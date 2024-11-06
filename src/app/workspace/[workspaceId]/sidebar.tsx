import { SidebarButton } from "./sidebar-button";
import { WorkspaceSwitcher } from "@/app/workspace/[workspaceId]/workspace-switcher";
import { UserButton } from "@/features/auth/components/user-button";
import {
  Bell,
  Home,
  Library,
  MessagesSquare,
  MoreHorizontal,
} from "lucide-react";
import { usePathname } from "next/navigation";

export const Sidebar = () => {
  const pathname = usePathname();
  return (
    <aside className="w-[70px] h-full bg-[#481349] flex flex-col gap-y-4 items-center pt-[9px] pb-4">
      <WorkspaceSwitcher />
      <SidebarButton
        // TODO:  can update
        icon={Home}
        label="Home"
        isActive={pathname.includes("/workspace")}
        className="hidden"
      />
      <SidebarButton
        // TODO:  can update
        icon={Library}
        label="Knowledge"
        isActive={pathname.includes("/knowledge")}
      />
      <SidebarButton icon={MessagesSquare} label="DMs" className="hidden" />
      <SidebarButton
        //TODO: not implemented yet 'Activty'
        icon={Bell}
        label="Activity"
        className="hidden"
      />
      <SidebarButton
        //TODO: not implemented yet 'Activty'
        icon={MoreHorizontal}
        label="More"
        className="hidden"
      />
      <div className="flex flex-col items-center justify-center gap-y-1 mt-auto">
        <UserButton />
      </div>
    </aside>
  );
};
