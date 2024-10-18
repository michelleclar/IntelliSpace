import { useParams } from "next/navigation";
import { Id } from "../../convex/_generated/dataModel";

export function useChatbotId() {
  const params = useParams();
  return params.chatbotId as Id<"channels">;
}
