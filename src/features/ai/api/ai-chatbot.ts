import { aiReplyFormatToDelta } from "@/features/ai/api/utils";
import { AiOptions, AiReply, AiRequestProps, AiResponseType } from "./ai-type";
import { useCallback, useMemo, useState } from "react";

const aiChatbotReplyFormat = (aiReply: string) => {
  return JSON.stringify(
    aiReplyFormatToDelta({ aiReply, modelName: "Chatbot" }),
  );
};

const aiChatbot = async ({ content, token }: AiRequestProps) => {
  if (content.replace(/<(.|\n)*?/g, "").trim().length === 0) {
    return null;
  }
  const message = {
    messages: [
      {
        role: "system",
        content: "you are a chatbot .",
      },
      {
        role: "user",
        content: `Answers this question: ${content},and reply in ${navigator.language} language`,
      },
    ],
    temperature: 1.0,
    top_p: 1.0,
    max_tokens: 1000,
    model: "gpt-4o-mini",
  };
  const DefaultOptions: RequestInit = {
    method: "POST",
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  };
  const r = await fetch(
    "https://models.inference.ai.azure.com/chat/completions",
    { ...DefaultOptions, body: JSON.stringify(message) },
  );
  if (r.ok) {
    const choices: AiReply = await r.json();
    return choices.choices[0];
  }

  return null;
};

export const useAiChatbot = () => {
  const [data, setData] = useState<AiResponseType>(null);
  const [error, setError] = useState<Error | null>(null);

  const [status, setStatus] = useState<
    "success" | "error" | "settled" | "pending" | null
  >(null);

  const isPending = useMemo(() => status === "pending", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);

  const mutate = useCallback(
    async (values: AiRequestProps, options?: AiOptions) => {
      try {
        setData(null);
        setError(null);

        setStatus("pending");

        const data = await aiChatbot(values);

        const aiReply = data?.message.content;
        if (!aiReply) {
          throw new Error("aiReply error");
        }

        const _body = aiChatbotReplyFormat(aiReply);
        options?.onSuccess?.(_body);
        return _body;
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
    [],
  );

  return { mutate, data, error, isPending, isSuccess, isError, isSettled };
};
