import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
interface UseGetChannelProps {
  id: Id<"channels">;
}
export const useGetChatbot = ({ id }: UseGetChannelProps) => {
  const chatbot = useQuery(api.chatbot.getById, { id });
  const isLoading = chatbot === void 0;

  return { chatbot, isLoading };
};
