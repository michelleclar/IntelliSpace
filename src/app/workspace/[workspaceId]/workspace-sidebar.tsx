import {
  AlertTriangle,
  HashIcon,
  Loader,
  MessageSquareText,
  SendHorizonal,
} from "lucide-react";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { WorkspaceHeader } from "./workspace-header";
import { SidebarItem } from "./sidebar-item";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { WorkspaceSection } from "./workspace-section";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { UserItem } from "@/app/workspace/[workspaceId]/user-item";
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-model";
import { useChannelId } from "@/hooks/use-channel-id";
import { useMemberId } from "@/hooks/use-member-id";

export const WorkspaceSidebar = () => {
  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();
  const memberId = useMemberId();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_open, setChannelOpen] = useCreateChannelModal();
  const { member, isLoading: memberIsLoading } = useCurrentMember({
    workspaceId,
  });
  const { workspace, isLoading: workspaceIsLoading } = useGetWorkspace({
    id: workspaceId,
  });

  const { channels, isLoading: channlesIsLoading } = useGetChannels({
    id: workspaceId,
  });

  const { members, isLoading: membersIsLoading } = useGetMembers({
    workspaceId,
  });

  if (workspaceIsLoading || memberIsLoading || channlesIsLoading || membersIsLoading) {
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
          id={channelId}
          variant="default"
        />
        <SidebarItem
          label="Drafts & Sent"
          icon={SendHorizonal}
          id={channelId}
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
            variant={channelId === item._id ? "active" : "default"}
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
            variant={item._id === memberId ? "active" : "default"}
          />
        ))}
      </WorkspaceSection>
    </div>
  );
};
