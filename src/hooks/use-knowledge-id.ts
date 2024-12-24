import { useParams } from "next/navigation";
import { Id } from "../../convex/_generated/dataModel";

export function useKnowledgeId() {
  const params = useParams();
  return params.knowledgeId as Id<"documents">;
}
