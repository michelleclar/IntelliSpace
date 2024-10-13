import { useParams } from "next/navigation";
import { Id } from "../../convex/_generated/dataModel";

export function useCanvasId() {
  const params = useParams();
  return params.canvasId as Id<"canvases">;
}
