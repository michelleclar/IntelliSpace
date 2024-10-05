import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
interface UseGetChannlesProps {
  id: Id<"workspaces">;
}
export const useGetChannels = ({ id }: UseGetChannlesProps) => {
  const channels = useQuery(api.channles.get, { workspaceId: id });
  const isLoading = channels === void 0;

  return { channels, isLoading };
};
