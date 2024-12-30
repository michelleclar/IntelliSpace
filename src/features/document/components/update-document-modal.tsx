import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import { useUpdateDocumentModal } from "../store/use-update-document-model";
import { useUpdateDocument } from "../api/use-update-document";
import { useDocumentId } from "@/hooks/use-document-id";

export function UpdateDocumentModal() {
  const router = useRouter();
  const [open, setOpen] = useUpdateDocumentModal();
  const { mutate, isPending } = useUpdateDocument();
  const workspaceId = useWorkspaceId();
  const documnetId = useDocumentId();

  const [title, setTitleName] = useState("");
  const handleChannge = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
    setTitleName(value);
  };

  const handleClose = () => {
    setTitleName("");
    setOpen(false);
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(title);

    mutate(
      { title, id: documnetId },
      {
        onSuccess(id) {
          toast.success("document created successfully");
          router.push(`/workspace/${workspaceId}/document/${id}`);
          handleClose();
        },
        onError() {
          toast.error("Failed to create document");
        },
        onSettled() {},
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Document</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={title}
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
