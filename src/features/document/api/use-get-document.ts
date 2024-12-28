import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
interface UseGetDocumentProps {
  documentId: Id<"document">;
}
export const useGetDocument = ({ documentId }: UseGetDocumentProps) => {
  const data = useQuery(api.document.getById, { documentId });
  const isLoading = data === void 0;

  return { data, isLoading };
};