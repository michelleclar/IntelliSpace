import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
interface UseGetCanvasProps {
  id: Id<"canvases">;
}
export const useGetCanvas = ({ id }: UseGetCanvasProps) => {
  const canvas = useQuery(api.canvases.getById, { id });
  const isLoading = canvas === void 0;

  return { canvas, isLoading };
};
