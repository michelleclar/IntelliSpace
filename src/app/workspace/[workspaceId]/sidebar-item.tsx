import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons/lib";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const sidebarItemVariants = cva(
  "flex items-center gap-1.5 justify-start font-normal h-7 px-[18px] text-sm overflow-hidden",
  {
    variants: {
      variant: {
        default: "text-[#f9edffcc]",
        active: "text-[#481349] bg-white/90 hover:bg-white/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

interface SidebarItemProps {
  label: string;
  icon: LucideIcon | IconType;
  variant?: VariantProps<typeof sidebarItemVariants>["variant"];
  redirect?: string;
}

export const SidebarItem = ({
  label,
  icon: Icon,
  variant,
  redirect = "",
}: SidebarItemProps) => {
  return (
    <>
      <Button
        variant="transparent"
        size="sm"
        className={cn(sidebarItemVariants({ variant }))}
        asChild
      >
        <Link href={redirect}>
          <Icon className="size-3.5" />
          <span className="text-sm truncate">{label}</span>
        </Link>
      </Button>
    </>
  );
};
