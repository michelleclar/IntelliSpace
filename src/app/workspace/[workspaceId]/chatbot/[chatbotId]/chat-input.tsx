import Quill from "quill";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";

import { Loader } from "lucide-react";

import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useChatbotId } from "@/hooks/use-chatbot-id";

import { Id } from "../../../../../../convex/_generated/dataModel";
import { useCreateMessage } from "@/features/messages/api/use-create-message";
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";
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

export const ChatInput = ({ placeholder }: ChatInputProps) => {
  const editorRef = useRef<Quill | null>(null);
  const [editorKey, setEditorKey] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const chatbotId = useChatbotId();
  const workspaceId = useWorkspaceId();

  const { mutate: createMessage } = useCreateMessage();
  const { mutate: generateUploadUrl } = useGenerateUploadUrl();

  const { data: systemconfig, isLoading: isLoadingSystemconfig } =
    useGetSystemconfig();

  // :NOTE: await ai token
  if (isLoadingSystemconfig || !systemconfig) {
    return (
      <div className="h-full flex-1 flex items-center justify-center">
        <Loader className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const handleCreateMessage = async (
    { channelId, workspaceId, body, parentMessageId }: CreateMessageValues,
    { _image }: { _image?: File | null },
  ) => {
    try {
      setIsPending(true);
      editorRef.current?.enable(false);

      const values: CreateMessageValues = {
        channelId,
        workspaceId,
        body,
        parentMessageId: parentMessageId,
        image: void 0,
      };

      if (_image) {
        const url = await generateUploadUrl({}, { throwError: true });

        if (!url) {
          throw new Error("Url not found");
        }

        const result = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": _image.type },
          body: _image,
        });

        if (!result.ok) {
          throw new Error("Failed to uoload image");
        }

        const { storageId } = await result.json();
        values.image = storageId;
      }
      const id = await createMessage(values, {
        throwError: true,
      });
      setEditorKey((prevKey) => prevKey + 1);
      return id;
    } catch (error) {
      toast.error("Failed to send message");
      console.log(error);
    } finally {
      setIsPending(false);
      editorRef.current?.enable(true);
    }
  };

  const handelSubmit = async ({
    body,
    image,
  }: {
    body: string;
    image: File | null;
  }) => {
    handleCreateMessage(
      { channelId: chatbotId, workspaceId, body, image: void 0 },
      { _image: image },
    );
  };

  return (
    <div className="px-5 w-full">
      <Editor
        key={editorKey}
        placeholder={placeholder}
        onSubmit={handelSubmit}
        disabled={isPending}
        innerRef={editorRef}
      />
    </div>
  );
};
