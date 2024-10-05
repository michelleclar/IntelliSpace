import {
  AlertTriangle,
  HashIcon,
  Loader,
  MessageSquareText,
  SendHorizonal,
} from "lucide-react";
import { useWorkspaceId } from "@/app/hooks/use-workspace-id";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { WorkspaceHeader } from "./workspace-header";
import { SidebarItem } from "./sidebar-item";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { WorkspaceSection } from "./workspace-section";
import { useGetMember } from "@/features/members/api/use-get-member";
import { UserItem } from "@/app/workspace/[workspaceId]/user-item";
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-model";

export const WorkspaceSidebar = () => {
  const id = useWorkspaceId();
  const [_open, setChannelOpen] = useCreateChannelModal();
  const { member, isLoading: memberIsLoading } = useCurrentMember({
    workspaceId: id,
  });
  const { workspace, isLoading: workspaceIsLoading } = useGetWorkspace({ id });

  const { channels, isLoading: channlesIsLoading } = useGetChannels({
    id,
  });

  const { members, isLoading: membersIsLoading } = useGetMember({
    workspaceId: id,
  });

  if (workspaceIsLoading || memberIsLoading) {
    return (
      <div className="flex flex-col bg-[#5E2C5F] h-full items-center justify-center">
        <Loader className="size-5 animate-spin text-white" />
      </div>
    );
  }

  if (!workspace || !member) {
    return (
      <div className="flex flex-col bg-[#5E2C5F] h-full items-center justify-center">
        <AlertTriangle className="size-5 animate-spin text-white" />
        <p>Workspace not fount</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-[#5E2C5F] h-full">
      <WorkspaceHeader
        workspace={workspace}
        isAdmin={member.role === "admin"}
      />
      <div className="flex flex-col px-2 mt-3">
        <SidebarItem
          label="Threads"
          icon={MessageSquareText}
          id="threads"
          variant="default"
        />
        <SidebarItem
          label="Drafts & Sent"
          icon={SendHorizonal}
          id="Drafts"
          variant="default"
        />
      </div>
      <WorkspaceSection
        label="Channels"
        hint="New Channel"
        onNew={
          member.role === "admin"
            ? () => {
                setChannelOpen(true);
              }
            : void 0
        }
      >
        {channels?.map((item) => (
          <SidebarItem
            key={item._id}
            icon={HashIcon}
            label={item.name}
            id={item._id}
            variant="default"
          />
        ))}
      </WorkspaceSection>

      <WorkspaceSection
        label="Direcrt Messsages"
        hint="New Direcrt Message"
        onNew={() => {}}
      >
        {members?.map((item) => (
          <UserItem
            key={item._id}
            id={item._id}
            label={item.user.name}
            image={item.user.image}
          />
        ))}
      </WorkspaceSection>
    </div>
  );
};
