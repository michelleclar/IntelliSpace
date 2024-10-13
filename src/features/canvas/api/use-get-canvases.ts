import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
interface UseGetCanvasesProps {
  id: Id<"workspaces">;
}

export const useGetCanvases = ({ id: workspaceId }: UseGetCanvasesProps) => {
  const canvases = useQuery(api.canvases.get, { workspaceId });
  const isLoading = canvases === void 0;

  return { canvases, isLoading };
};
