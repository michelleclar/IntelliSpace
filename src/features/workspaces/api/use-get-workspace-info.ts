import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
interface UseGetWorkspaceInfoProps {
  id: Id<"workspaces">;
}
export const useGetWorkspaceInfo = ({ id }: UseGetWorkspaceInfoProps) => {
  const workspace = useQuery(api.workspaces.getInfoById, { id });
  const isLoading = workspace === void 0;

  return { workspace, isLoading };
};
