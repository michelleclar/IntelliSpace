import Quill from "quill";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";

import { useCreateMessage } from "@/features/messages/api/use-create-message";
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";

import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { Languages, Loader, MessageCircleQuestion } from "lucide-react";
import { useTranslateText } from "@/features/ai/api/use-translate-text";
import { useGetSystemconfig } from "@/features/ai/api/use-get-systemconfig";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface ChatInputProps {
  placeholder: string;
}

type CreateMessageValues = {
  channelId: Id<"channels">;
  workspaceId: Id<"workspaces">;
  body: string;
  image: Id<"_storage"> | undefined;
  parentMessageId?: Id<"messages">;
};

type AiReplyProps = {
  userMessage: string;
  text: string | undefined;
  image: File | null;
};

export const ChatInput = ({ placeholder }: ChatInputProps) => {
  const editorRef = useRef<Quill | null>(null);
  const [editorKey, setEditorKey] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const { mutate: createMessage } = useCreateMessage();
  const { mutate: generateUploadUrl } = useGenerateUploadUrl();
  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();
  const { data: systemconfig, isLoading: isLoadingSystemconfig } =
    useGetSystemconfig();
  // const handelAiReply = async ({ body }: { body: string }) => {
  //
  //   await createMessage(values, { throwError: true });
  //   setEditorKey((prevKey) => prevKey + 1);
  // };
  const handelSubmit = async ({
    body,
    image,
  }: {
    body: string;
    image: File | null;
  }) => {
    try {
      setIsPending(true);
      editorRef.current?.enable(false);

      const values: CreateMessageValues = {
        channelId,
        workspaceId,
        body,
        image: void 0,
      };

      if (image) {
        const url = await generateUploadUrl({}, { throwError: true });

        if (!url) {
          throw new Error("Url not found");
        }

        const result = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": image.type },
          body: image,
        });

        if (!result.ok) {
          throw new Error("Failed to uoload image");
        }

        const { storageId } = await result.json();
        values.image = storageId;
      }
      await createMessage(values, {
        throwError: true,
      });
      setEditorKey((prevKey) => prevKey + 1);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setIsPending(false);
      editorRef.current?.enable(true);
    }
  };

  if (isLoadingSystemconfig || !systemconfig) {
    return (
      <div className="h-full flex-1 flex items-center justify-center">
        <Loader className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }
  const handelTranslateText = async (message: string | undefined) => {
    if (isLoadingSystemconfig || !systemconfig) return;
    if (!message) throw new Error("Ai reply message is null");
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const choice = await useTranslateText({
      content: message,
      token: systemconfig.aiApiToken,
    });
    const aiReply = choice?.message.content;
    return {
      ops: [
        {
          attributes: {
            bold: true,
          },
          insert: `${aiReply}`,
        },
      ],
    };
  };

  const AI = [
    {
      value: "transition",
      label: "Transition",
      icon: Languages,
      handleReply: async ({ userMessage, text, image }: AiReplyProps) => {
        setIsPending(true);

        editorRef.current?.enable(false);
        try {
          const values: CreateMessageValues = {
            channelId,
            workspaceId,
            body: userMessage,
            image: void 0,
          };

          if (image) {
            const url = await generateUploadUrl({}, { throwError: true });

            if (!url) {
              throw new Error("Url not found");
            }

            const result = await fetch(url, {
              method: "POST",
              headers: { "Content-Type": image.type },
              body: image,
            });

            if (!result.ok) {
              throw new Error("Failed to uoload image");
            }

            const { storageId } = await result.json();
            values.image = storageId;
          }

          await createMessage(values, {
            onSuccess: async (id) => {
              if (!id) {
                return;
              }
              const messageId = id;
              const aiReply = await handelTranslateText(text);
              const aiReplyValues: CreateMessageValues = {
                channelId,
                workspaceId,
                parentMessageId: messageId,
                body: JSON.stringify(aiReply),
                image: void 0,
              };
              await createMessage(aiReplyValues, { throwError: true });
            },
            throwError: true,
          });
          setEditorKey((prevKey) => prevKey + 1);
        } catch (error) {
          toast.error("Ai Failed to reply message");
          console.log(error);
        } finally {
          setIsPending(false);
          editorRef.current?.enable(true);
        }
      },
    },
    {
      value: "question",
      label: "Question",
      icon: MessageCircleQuestion,
      handleReply: async ({ userMessage }: AiReplyProps) => {
        if (isLoadingSystemconfig || !systemconfig) return;
        setIsPending(true);
        editorRef.current?.enable(false);
        try {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const choice = await useTranslateText({
            content: userMessage,
            token: systemconfig.aiApiToken,
          });

          const aiReply = choice?.message.content;
          const body = {
            ops: [
              {
                attributes: {
                  bold: true,
                },
                insert: `${aiReply}`,
              },
              {
                insert: "\\n",
              },
            ],
          };
          const values: CreateMessageValues = {
            channelId,
            workspaceId,
            // parentMessageId: parentMessage,
            body: JSON.stringify(body),
            image: void -1,
          };
          await createMessage(values, { throwError: true });
          setEditorKey((prevKey) => prevKey + 1);
        } catch (error) {
          toast.error("Ai Failed to reply message");
          console.log(error);
        } finally {
          setIsPending(false);
          editorRef.current?.enable(true);
        }
      },
    },
  ];

  return (
    <div className="px-5 w-full">
      <Editor
        key={editorKey}
        placeholder={placeholder}
        onSubmit={handelSubmit}
        disabled={isPending}
        innerRef={editorRef}
        aiReplyModel={{ AIModel: AI }}
      />
    </div>
  );
};
