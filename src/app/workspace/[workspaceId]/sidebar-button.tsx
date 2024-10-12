import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { IconType } from "react-icons/lib";
interface SibebarButtonProps {
  icon: LucideIcon | IconType;
  label: string;
  isActive?: boolean;
  className?: string;
}
export const SidebarButton = ({
  icon: Icon,
  label,
  isActive,
  className,
}: SibebarButtonProps) => {
  const route = useRouter();
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-y-0.5 cursor-pointer group",
        className,
      )}
    >
      <Button
        variant="transparent"
        className={cn(
          "size-9 p-2 group-hover:bg-accent/20",
          isActive && "bg-accent/20",
        )}
        onClick={() => {
          if (isActive) return;
          if (label === "Home") {
            route.push(`/`);
            return;
          }
          if (label === "Canva") {
            const workspaceId = useWorkspaceId();
            route.push(`/workspace/${workspaceId}/canva`);
            return;
          }
        }}
      >
        <Icon className="size-5 text-white group-hover:scale-110 transition-all" />
      </Button>

      <span className="text-[11px] text-white group-hover:text-accent">
        {label}
      </span>
    </div>
  );
};
