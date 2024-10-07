"use client";

import { ChatInput } from "./chat-input";
import { Header } from "./header";
import { useGetChannel } from "@/features/channels/api/use-get-channle";
import { useChannelId } from "@/hooks/use-channel-id";
import { Loader, TriangleAlert } from "lucide-react";

const ChannelIdPage = () => {
  const channelId = useChannelId();
  const { channel, isLoading: channelIsLoading } = useGetChannel({
    id: channelId,
  });
  if (channelIsLoading) {
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
      <div className="flex-1" />
      <ChatInput />
    </div>
  );
};

export default ChannelIdPage;
