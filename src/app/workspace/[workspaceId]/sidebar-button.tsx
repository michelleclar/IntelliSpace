import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Button } from "@/components/ui/button";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { cn } from "@/lib/utils";
import { Info, LucideIcon, Search } from "lucide-react";
import { IconType } from "react-icons/lib";
interface SibebarButtonProps {
  icon: LucideIcon | IconType;
  label: string;
  isActive?: boolean;
}
export const SidebarButton = ({
  icon: Icon,
  label,
  isActive,
}: SibebarButtonProps) => {
  return (
    <div className=" flex flex-col items-center justify-center gap-y-0.5 cursor-pointer group">
      <Button
        variant="transparent"
        className={cn(
          "size-9 p-2 group-hover:bg-accent/20",
          isActive && "bg-accent/20",
        )}
      >
        <Icon className="size-5 text-white group-hover:scale-110 transition-all" />
      </Button>

      <span className="text-[11px] text-white group-hover:text-accent">
        {label}
      </span>
    </div>
  );
};
