import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useCreateCanvas } from "@/features/canvas/api/use-create-canvas";
import { useCreateCanvasModal } from "@/features/canvas/store/use-create-canvas-model";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function CreateCanvasModal() {
  const router = useRouter();
  const [open, setOpen] = useCreateCanvasModal();
  const { mutate, isPending } = useCreateCanvas();
  const workspaceId = useWorkspaceId();

  const [canvasName, setChannelName] = useState("");
  const handleChannge = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
    setChannelName(value);
  };

  const handleClose = () => {
    setChannelName("");
    setOpen(false);
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(canvasName);

    mutate(
      { name: canvasName, workspaceId },
      {
        onSuccess(id) {
          toast.success("Canvas created successfully");
          router.push(`/workspace/${workspaceId}/canvas/${id}`);
          handleClose();
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onError(error) {
          toast.error("Failed to create canvas");
        },
        onSettled() {},
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a Canvas</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={canvasName}
            disabled={isPending}
            onChange={handleChannge}
            required
            autoFocus
            minLength={3}
            maxLength={80}
            placeholder="e.g. plan-budge "
          />
          <div className="flex justify-end">
            <Button disabled={isPending}>Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
