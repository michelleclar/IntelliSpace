import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { TrashIcon } from "lucide-react";
import { FaChevronDown } from "react-icons/fa";

import { useConfirm } from "@/hooks/use-confirm";
import { useChatbotId } from "@/hooks/use-chatbot-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useUpdateChatbot } from "@/features/chatbot/api/use-update-chatbot";
import { useRemoveChatbot } from "@/features/chatbot/api/use-remove-chatbot";

interface HeaderProps {
  title: string;
}
export const Header = ({ title }: HeaderProps) => {
  const router = useRouter();
  const chatbotId = useChatbotId();
  const workspaceId = useWorkspaceId();

  const [value, setValue] = useState(title);
  const [editOpen, setEditOpen] = useState(false);

  const [ConfirmDialog, confirm] = useConfirm(
    "Delete this chatbot?",
    "You are about to delete this chatbot. This action is irreversible",
  );

  const { member } = useCurrentMember({ workspaceId });
  const { mutate: updateChatbot, isPending: isUpdateingChatbot } =
    useUpdateChatbot();
  const { mutate: removeChatbot, isPending: isRemoveingChatbot } =
    useRemoveChatbot();

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

    removeChatbot(
      { id: chatbotId },
      {
        onSuccess: () => {
          router.push(`/workspace/${workspaceId}`);
          toast.success("chatbot deleted");
        },
        onError: () => {
          toast.success("Faile do deleted chatbot");
        },
      },
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateChatbot(
      { id: chatbotId, name: value },
      {
        onSuccess: () => {
          toast.success("chatbot updated");
          setEditOpen(false);
        },
        onError: () => {
          toast.error("Failed to update chatbot");
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
                    <p className="text-sm font-semibold"> Chatbot name</p>
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
                  <DialogTitle>Rename this chatbot</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    value={value}
                    onChange={handleChannge}
                    disabled={isUpdateingChatbot}
                    required
                    autoFocus
                    minLength={3}
                    maxLength={80}
                    placeholder="e.g. plan-budget"
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" disabled={isUpdateingChatbot}>
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button disabled={isUpdateingChatbot}>Save</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            {member?.role === "admin" && (
              <button
                className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg cursor-pointer border hover:bg-gray-50 text-rose-600"
                disabled={isRemoveingChatbot}
                onClick={handleRemove}
              >
                <TrashIcon className="size-4" />

                <p className="text-sm font-semibold">Delete chatbot</p>
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
