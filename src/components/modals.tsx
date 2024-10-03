"use client";

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
      <CreateWorkspaceModal></CreateWorkspaceModal>
    </>
  );
}
