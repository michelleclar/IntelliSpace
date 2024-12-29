import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export const useGetTrash = () => {
    const data = useQuery(api.document.getTrash);
    const isLoading = data === void 0;

    return {data, isLoading};
};