"use client";

import { ChatInput } from "./chat-input";
import { Header } from "./header";
import { useGetMessages } from "@/features/messages/api/use-get-messages";
import { Loader, TriangleAlert } from "lucide-react";
import { MessageList } from "@/components/message-list";
import { useChatbotId } from "@/hooks/use-chatbot-id";
import { useGetChatbot } from "@/features/chatbot/api/use-get-chatbot";

const ChatbotIdPage = () => {
  const chatbotId = useChatbotId();
  const { chatbot, isLoading: channelIsLoading } = useGetChatbot({
    id: chatbotId,
  });

  const { results, status, loadMore } = useGetMessages({
    channelId: chatbotId,
  });

  if (channelIsLoading || status === "LoadingFirstPage") {
    return (
      <div className="h-full flex-1 flex items-center justify-center">
        <Loader className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!chatbot) {
    return (
      <div className="h-full flex-1 flex flex-col gap-y-2 items-center justify-center">
        <TriangleAlert className="size-5 text-muted-foreground" />
        <span className="text-muted-foreground  text-sm">
          Channel not fount
        </span>
      </div>
    );
  }
  return (
    <div className="flex-col flex h-full">
      <Header title={chatbot.name} />
      <MessageList
        channelName={chatbot.name}
        channelCreationTime={chatbot._creationTime}
        data={results}
        loadMore={loadMore}
        isLoadingMore={status === "LoadingMore"}
        canLoadMore={status === "CanLoadMore"}
      />
      <ChatInput placeholder={`Messsage # ${chatbot.name}`} />
    </div>
  );
};

export default ChatbotIdPage;
