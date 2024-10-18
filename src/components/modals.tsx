"use client";
import { useEffect, useState } from "react";

import { CreateCanvasModal } from "@/features/canvas/components/create-canvas-modal";
import { CreateChannelModal } from "@/features/channels/components/create-channel-modal";
import { CreateChatbotModal } from "@/features/chatbot/components/create-chatbot-modal";
import { CreateWorkspaceModal } from "@/features/workspaces/components/create-woekspace-modal";

export function Modals() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return (
    <>
      <CreateChannelModal />
      <CreateWorkspaceModal />
      <CreateCanvasModal />
      <CreateChatbotModal />
    </>
  );
}
