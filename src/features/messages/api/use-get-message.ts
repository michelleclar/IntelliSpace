import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
interface UseGetMessageProps {
  id: Id<"messages">;
}
export const useGetMessage = ({ id }: UseGetMessageProps) => {
  const message = useQuery(api.messages.getById, { id });
  const isLoading = message === void 0;

  return { message, isLoading };
};
