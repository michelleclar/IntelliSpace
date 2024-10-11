import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCallback, useMemo, useState } from "react";

type ResponsseType = string | null;
type Options = {
  onSuccess?: (data: never) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};
export const useGenerateUploadUrl = () => {
  const [data, setData] = useState<ResponsseType>(null);
  const [error, setError] = useState<Error | null>(null);

  const [status, setStatus] = useState<
    "success" | "error" | "settled" | "pending" | null
  >(null);

  const isPending = useMemo(() => status === "pending", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);

  const mutation = useMutation(api.upload.generateUploadUrl);

  const mutate = useCallback(
    async (_values: object, options?: Options) => {
      try {
        setData(null);
        setError(null);

        setStatus("pending");

        const response = await mutation();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        options?.onSuccess?.(response);
        return response;
      } catch (error) {
        setStatus("error");
        options?.onError?.(error as Error);
        if (options?.throwError) {
          throw error;
        }
      } finally {
        setStatus("settled");
        options?.onSettled?.();
      }
    },
    [mutation],
  );

  return { mutate, data, error, isPending, isSuccess, isError, isSettled };
};
