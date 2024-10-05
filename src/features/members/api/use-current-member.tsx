import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
interface UseCurrentMemberProps {
  workspaceId: Id<"workspaces">;
}
export const useCurrentMember = ({ workspaceId }: UseCurrentMemberProps) => {
  const member = useQuery(api.members.current, { workspaceId });
  const isLoading = member === void 0;

  return { member, isLoading };
};
