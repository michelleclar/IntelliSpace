"use client";

import { useWorkspaceId } from "@/app/hooks/use-workspace-id";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";

const WorkspaceIdPage = () => {
  const workspaceId = useWorkspaceId();
  const workspace = useGetWorkspace({ id: workspaceId });

  return <div>Workspace id page</div>;
};

export default WorkspaceIdPage;
