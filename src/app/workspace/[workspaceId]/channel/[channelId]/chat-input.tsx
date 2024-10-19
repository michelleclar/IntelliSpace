import Quill from "quill";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";

import { useCreateMessage } from "@/features/messages/api/use-create-message";
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";

import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Id } from "../../../../../../convex/_generated/dataModel";
import {
  Brain,
  Code,
  Languages,
  Loader,
  MessageCircleQuestion,
} from "lucide-react";
import {
  aiTranslateText,
  aiTranslateTextReplyFormat,
} from "@/features/ai/api/ai-translate-text";
import { useGetSystemconfig } from "@/features/ai/api/use-get-systemconfig";
import {
  aiOptimizationUserPrompt,
  aiOptimizationUserPromptReplyFormat,
} from "@/features/ai/api/ai-optimization-user-prompt";
import { AiRequestProps, Choice } from "@/features/ai/api/ai-type";
import {
  aiExplainCode,
  aiExplainCodeReplyFormat,
} from "@/features/ai/api/ai-explain-code";

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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setIsPending(false);
      editorRef.current?.enable(true);
    }
  };

  const aiReplyMessage = async ({
    aiReplyProps: { userMessage, text, image },
    aiExecuteMethod,
    aiReplyFormatMethod,
  }: {
    aiReplyProps: AiReplyProps;
    aiExecuteMethod: ({content,token}: AiRequestProps) => Promise<Choice | undefined>;
    aiReplyFormatMethod: (args: string) => string;
  }) => {
    const parentMessageId = await handleCreateMessage(
      { channelId, workspaceId, body: userMessage, image: void 0 },
      { _image: image },
    );

    if (!text) throw new Error("Ai reply message is null");
    await aiExecuteMethod({ content: text, token: systemconfig.aiApiToken });
    const choice = await aiExecuteMethod({
      content: text,
      token: systemconfig.aiApiToken,
    });

    const aiReply = choice?.message.content;

    if (!aiReply) throw new Error("Ai reply message is null");
    const aiReplyFormatToQuill = aiReplyFormatMethod(aiReply);

    handleCreateMessage(
      {
        channelId,
        workspaceId,
        parentMessageId,
        body: aiReplyFormatToQuill,
        image: void 0,
      },
      { _image: null },
    );
  };

  // NOTE: translate form ai ,and ai reply formated 'Quill'
  const handleTranslateText = async ({
    userMessage,
    text,
    image,
  }: AiReplyProps) => {
    aiReplyMessage({
      aiReplyProps: { userMessage, text, image },
      aiExecuteMethod: aiTranslateText,
      aiReplyFormatMethod: aiTranslateTextReplyFormat,
    });
  };

  // NOTE: optimization form ai ,and ai reply formated 'Quill'
  const handleOptimizationUserPrompt = async ({
    userMessage,
    text,
    image,
  }: AiReplyProps) => {
    aiReplyMessage({
      aiReplyProps: { userMessage, text, image },
      aiExecuteMethod: aiOptimizationUserPrompt,
      aiReplyFormatMethod: aiOptimizationUserPromptReplyFormat,
    });
  };

  // NOTE: explain form ai ,and ai reply formated 'Quill'
  const handleExplainCode = async ({
    userMessage,
    text,
    image,
  }: AiReplyProps) => {
    aiReplyMessage({
      aiReplyProps: { userMessage, text, image },
      aiExecuteMethod: aiExplainCode,
      aiReplyFormatMethod: aiExplainCodeReplyFormat,
    });
  };

  const AI = [
    {
      value: "transition",
      label: "Transition",
      icon: Languages,
      handleReply: handleTranslateText,
    },
    {
      value: "explain code",
      label: "CODEWALK",
      icon: Code,
      handleReply: handleExplainCode,
    },
    {
      value: "optimization prompt",
      label: "OPT",
      icon: Brain,
      handleReply: handleOptimizationUserPrompt,
    },
    {
      value: "question",
      label: "Q",
      icon: MessageCircleQuestion,
      handleReply: handleOptimizationUserPrompt,
    },
  ];

  const handelSubmit = async ({
    body,
    image,
  }: {
    body: string;
    image: File | null;
  }) => {
    handleCreateMessage(
      { channelId, workspaceId, body, image: void 0 },
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
        aiReplyModel={{ AIModel: AI }}
      />
    </div>
  );
};
