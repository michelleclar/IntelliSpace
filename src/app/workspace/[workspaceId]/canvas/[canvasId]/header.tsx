import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { TrashIcon } from "lucide-react";
import { FaChevronDown } from "react-icons/fa";
import { DialogClose } from "@radix-ui/react-dialog";

import { useConfirm } from "@/hooks/use-confirm";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

import { Id } from "../../../../../../convex/_generated/dataModel";
import { useRemoveCanvas } from "@/features/canvas/api/use-remove-canvas";
import { useUpdateCanvas } from "@/features/canvas/api/use-update-canvas";
import { useCurrentMember } from "@/features/members/api/use-current-member";

interface HeaderProps {
  title: string;
  id: Id<"canvases">;
}
export const Header = ({ title, id }: HeaderProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [value, setValue] = useState(title);
  const [editOpen, setEditOpen] = useState(false);
  const [ConfirmDialog, confirm] = useConfirm(
    "Delete this canvas?",
    "You are about to delete this canvas. This action is irreversible",
  );
  const { member } = useCurrentMember({ workspaceId });

  const { mutate: updateCanvas, isPending: isUpdateingCanvas } =
    useUpdateCanvas();
  const { mutate: removeCanvas, isPending: isRemoveingCanvas } =
    useRemoveCanvas();

  const handleChannge = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
    setValue(value);
  };

  const handleEditOpen = (value: boolean) => {
    if (member?.role !== "admin") return;
    setEditOpen(value);
  };

  const handleRemove = async () => {
    const ok = await confirm();
    if (!ok) return;

    removeCanvas(
      { id },
      {
        onSuccess: () => {
          router.push(`/workspace/${workspaceId}`);
          toast.success("Canvas deleted");
        },
        onError: () => {
          toast.success("Faile do deleted Canvas");
        },
      },
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateCanvas(
      { id, name: value },
      {
        onSuccess: () => {
          toast.success("Canvas updated");
          setEditOpen(false);
        },
        onError: () => {
          toast.error("Failed to update Canvas");
        },
      },
    );
  };

  return (
    <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
      <ConfirmDialog />
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="text-lg font-semibold px-2 overflow-hidden w-auto"
            size="sm"
          >
            <span className="truncate"># {title}</span>
            <FaChevronDown className="size-2.5 ml-2" />
          </Button>
        </DialogTrigger>
        <DialogContent className="p-0 bg-gray-50 overflow-hidden">
          <DialogHeader className="p-4 border-b bg-white ">
            <DialogTitle># {title}</DialogTitle>
          </DialogHeader>
          <div className="px-4 pb-4 flex flex-col gap-y-2">
            <Dialog open={editOpen} onOpenChange={handleEditOpen}>
              <DialogTrigger asChild>
                <div className="px-5 py-4 bg-white rounded-lg border-b cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold"> Canvas name</p>
                    {member?.role === "admin" && (
                      <p className="text-sm text-[#1264a3] hover:underline font-semibold">
                        Edit
                      </p>
                    )}
                  </div>
                  <p className="text-sm"># {title}</p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rename this canvas</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    value={value}
                    onChange={handleChannge}
                    disabled={isUpdateingCanvas}
                    required
                    autoFocus
                    minLength={3}
                    maxLength={80}
                    placeholder="e.g. plan-budget"
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" disabled={isUpdateingCanvas}>
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button disabled={isUpdateingCanvas}>Save</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            {member?.role === "admin" && (
              <button
                className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg cursor-pointer border hover:bg-gray-50 text-rose-600"
                disabled={isRemoveingCanvas}
                onClick={handleRemove}
              >
                <TrashIcon className="size-4" />

                <p className="text-sm font-semibold">Delete canvas</p>
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
