import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
interface UseGetMemberProps {
  id: Id<"members">;
}
export const useGetMember = ({ id }: UseGetMemberProps) => {
  const member = useQuery(api.members.getById, { id });
  const isLoading = member === void 0;

  return { member, isLoading };
};
