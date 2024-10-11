import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useCreateChannel } from "@/features/channels/api/use-create-channel";
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-model";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function CreateChannelModal() {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [open, setOpen] = useCreateChannelModal();
  const { mutate, isPending } = useCreateChannel();

  const [channelName, setChannelName] = useState("");
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
    mutate(
      { name: channelName, workspaceId },
      {
        onSuccess(id) {
          toast.success("Channel created successfully");
          router.push(`/workspace/${workspaceId}/channel/${id}`);
          handleClose();
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onError(error) {
          toast.error("Failed to create channel");
        },
        onSettled() {},
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a channel</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={channelName}
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
