import { aiReplyFormatToDelta } from "@/features/ai/api/utils";
import { AiReply, AiRequestProps } from "./ai-type";

export const aiOptimizationUserPromptReplyFormat = (aiReply: string) => {
  return JSON.stringify(
    aiReplyFormatToDelta({ aiReply, modelName: "Optimization Prompt" }),
  );
};

export const aiOptimizationUserPrompt = async ({
  content,
  token,
}: AiRequestProps) => {
  const message = {
    messages: [
      {
        role: "system",
        content: `You are a prompt engineer, and reply in ${navigator.language} language`,
      },
      {
        role: "user",
        content: `Please review the prompt “${content}“ for LLM model. Enhance the prompt with enriched text for better results, and reply in ${navigator.language} language`,
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

  return void 0;
};