import {
    AlertTriangle,
    HashIcon,
    Loader,
    MessageSquareText,
    Palette,
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
import { useGetCanvases } from "@/features/canvas/api/use-get-canvases";
import { useCreateCanvasModal } from "@/features/canvas/store/use-create-canvas-model";
import { useCanvasId } from "@/hooks/use-canvas-id";
import { useGetChatbots } from "@/features/chatbot/api/use-get-chatbots";
import { useChatbotId } from "@/hooks/use-chatbot-id";
import { useCreateChatbotModal } from "@/features/chatbot/store/use-create-chatbot-model";
import { useGetDocuments } from "@/features/document/api/use-get-documents";
import { useDocumentId } from "@/hooks/use-document-id";
import { useState } from "react";
import { DocumentList, DocumentSidebar } from "@/app/workspace/[workspaceId]/document-item";

export const WorkspaceSidebar = () => {
    const channelId = useChannelId();
    const workspaceId = useWorkspaceId();
    const memberId = useMemberId();
    const canvasId = useCanvasId();
    const chatbotId = useChatbotId();
    const documentId = useDocumentId();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_open, setChannelOpen] = useCreateChannelModal();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, setCanvasOpen] = useCreateCanvasModal();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [__, setChatbotOpen] = useCreateChatbotModal();

    const {member, isLoading: memberIsLoading} = useCurrentMember({
        workspaceId,
    });
    const {workspace, isLoading: workspaceIsLoading} = useGetWorkspace({
        id: workspaceId,
    });

    const {channels, isLoading: channlesIsLoading} = useGetChannels({
        id: workspaceId,
    });

    const {chatbots, isLoading: chatbotsIsLoading} = useGetChatbots({
        id: workspaceId,
    });

    const {members, isLoading: membersIsLoading} = useGetMembers({
        workspaceId,
    });

    const {documents, isLoading: documentsIsLoading} = useGetDocuments({})

    const {canvases} = useGetCanvases({
        id: workspaceId,
    });

    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    const onExpand = (documentId: string) => {
        setExpanded((prevExpanded) => ({
            ...prevExpanded,
            [documentId]: !prevExpanded[documentId],
        }));
    };

    if (
        workspaceIsLoading ||
        memberIsLoading ||
        channlesIsLoading ||
        membersIsLoading ||
        chatbotsIsLoading ||
        documentsIsLoading
    ) {
        return (
            <div className="flex flex-col bg-[#5E2C5F] h-full items-center justify-center">
                <Loader className="size-5 animate-spin text-white"/>
            </div>
        );
    }

    if (!workspace || !member) {
        return (
            <div className="flex flex-col bg-[#5E2C5F] h-full items-center justify-center">
                <AlertTriangle className="size-5 animate-spin text-white"/>
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
            <div
                //TODO: Not yet implemented Threads and Drafts & sent
                className="flex-col px-2 mt-3 hidden"
            >
                <SidebarItem
                    label="Threads"
                    icon={MessageSquareText}
                    variant="default"
                />
                <SidebarItem
                    label="Drafts & Sent"
                    icon={SendHorizonal}
                    variant="default"
                />
            </div>

            <WorkspaceSection
                //TODO add document list components
                label="Document"
                hint="New Document"
                onNew={
                    member.role === "admin"
                        ? () => {
                            setChannelOpen(true);
                        }
                        : void 0
                }
            >
                {documents?.map((item) => (
                    <div key={item._id}>


                        <SidebarItem
                            key={item._id}
                            icon={HashIcon}
                            label={item.title}
                            variant={documentId === item._id ? "active" : "default"}
                            redirect={`/workspace/${workspaceId}/document/${item._id}`}

                        />
                        {expanded[item._id] && (
                            <SidebarItem key={document._id} level={level + 1}/>
                        )}
                    </div>
                ))}
            </WorkspaceSection>
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
                        variant={channelId === item._id ? "active" : "default"}
                        redirect={`/workspace/${workspaceId}/channel/${item._id}`}
                    />
                ))}
            </WorkspaceSection>
            <WorkspaceSection
                // TODO: canvas ,need ai to image to image or text to image
                label="Canvases"
                hint="New Canvas"
                onNew={
                    member.role === "admin"
                        ? () => {
                            setCanvasOpen(true);
                        }
                        : void 0
                }
            >
                {canvases?.map((item) => (
                    <SidebarItem
                        key={item._id}
                        icon={Palette}
                        label={item.name}
                        variant={canvasId === item._id ? "active" : "default"}
                        redirect={`/workspace/${workspaceId}/canvas/${item._id}`}
                    />
                ))}
            </WorkspaceSection>
            <WorkspaceSection
                label="Chat bot"
                hint="New Chat bot"
                onNew={
                    member.role === "admin"
                        ? () => {
                            setChatbotOpen(true);
                            console.log("chat");
                        }
                        : void 0
                }
            >
                {chatbots?.map((item) => (
                    <SidebarItem
                        key={item._id}
                        icon={HashIcon}
                        label={item.name}
                        variant={chatbotId === item._id ? "active" : "default"}
                        redirect={`/workspace/${workspaceId}/chatbot/${item._id}`}
                        onExpand={()=>onExpand(item._id)}
                    />

                ))}
            </WorkspaceSection>
            <WorkspaceSection
                label="Direcrt Messsages"
                hint="New Direcrt Message"
                onNew={() => {
                }}
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
