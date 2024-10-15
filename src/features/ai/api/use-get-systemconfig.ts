import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export const useGetSystemconfig = () => {
  const data = useQuery(api.systemconfig.get);
  const isLoading = data === void 0;

  return { data, isLoading };
};
