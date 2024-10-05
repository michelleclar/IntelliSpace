"use client";

import { CreateChannelModal } from "@/features/channels/components/create-channel-modal";
import { CreateWorkspaceModal } from "@/features/workspaces/components/create-woekspace-modal";
import { useEffect, useState } from "react";

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
    </>
  );
}
