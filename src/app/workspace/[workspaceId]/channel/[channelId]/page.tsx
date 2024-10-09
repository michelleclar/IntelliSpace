"use client";

import { ChatInput } from "./chat-input";
import { Header } from "./header";
import { useGetChannel } from "@/features/channels/api/use-get-channle";
import { useGetMessages } from "@/features/messages/api/use-get-messages";
import { useChannelId } from "@/hooks/use-channel-id";
import { Loader, TriangleAlert } from "lucide-react";
import { MessageList } from "@/components/message-list";

const ChannelIdPage = () => {
  const channelId = useChannelId();
  const { channel, isLoading: channelIsLoading } = useGetChannel({
    id: channelId,
  });

  const { results, status, loadMore } = useGetMessages({ channelId });

  if (channelIsLoading || status === "LoadingFirstPage") {
    return (
      <div className="h-full flex-1 flex items-center justify-center">
        <Loader className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!channel) {
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
      <Header title={channel.name} />
      <MessageList
        channelName={channel.name}
        channelCreationTime={channel._creationTime}
        data={results}
        loadMore={loadMore}
        isLoadingMore={status === "LoadingMore"}
        canLoadMore={status === "CanLoadMore"}
      />
      <ChatInput placeholder={`Messsage # ${channel.name}`} />
    </div>
  );
};

export default ChannelIdPage;
