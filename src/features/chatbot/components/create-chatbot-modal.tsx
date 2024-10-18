import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useWorkspaceId } from "@/hooks/use-workspace-id";

import { useCreateChatbot } from "@/features/chatbot/api/use-create-chatbot";
import { useCreateChatbotModal } from "@/features/chatbot/store/use-create-chatbot-model";

export function CreateChatbotModal() {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const [channelName, setChannelName] = useState("");
  const [open, setOpen] = useCreateChatbotModal();
  const { mutate, isPending } = useCreateChatbot();

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
          toast.success("chatbot created successfully");
          router.push(`/workspace/${workspaceId}/chatbot/${id}`);
          handleClose();
        },
        onError(error) {
          toast.error("Failed to create chatbot");
          console.log(error);
        },
      },
    );
  };
  //TODO: add chatbot role,e.g. teach
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a chatbot</DialogTitle>
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
