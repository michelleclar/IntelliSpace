import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetDocumentsProps {
  parentDocumentId?: Id<"document">;
}

export const useGetDocuments = ({ parentDocumentId }: UseGetDocumentsProps) => {
  const documents = useQuery(api.document.getDocumentListIsNotArchive, {
    parentDocumentId,
  });
  const isLoading = documents === void 0;

  return { documents, isLoading };
};
