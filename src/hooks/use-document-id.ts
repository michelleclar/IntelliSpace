import { useParams } from "next/navigation";
import { Id } from "../../convex/_generated/dataModel";

export function useDocumentId() {
  const params = useParams();
  return params.documentId as Id<"document">;
}