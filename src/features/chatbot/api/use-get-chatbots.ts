import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
interface UseGetChannlesProps {
  id: Id<"workspaces">;
}
export const useGetChatbots = ({ id }: UseGetChannlesProps) => {
  const chatbots = useQuery(api.chatbot.get, { workspaceId: id });
  const isLoading = chatbots === void 0;

  return { chatbots, isLoading };
};
