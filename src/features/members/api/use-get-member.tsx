import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
interface UseGetMemberProps {
  workspaceId: Id<"workspaces">;
}
export const useGetMember = ({ workspaceId }: UseGetMemberProps) => {
  const members = useQuery(api.members.get, { workspaceId });
  const isLoading = members === void 0;

  return { members, isLoading };
};
