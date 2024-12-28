import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetDocumentsProps {
  parentDocument?: Id<"document">;
}

export const useGetDocuments = ({ parentDocument }: UseGetDocumentsProps) => {
  const documents = useQuery(api.document.getDocumentListIsNotArchive, { parentDocument });
  const isLoading = documents === void 0;

  return { documents, isLoading };
};