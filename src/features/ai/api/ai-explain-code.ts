import { aiReplyFormatToDelta } from "./utils";
import { AiReply, AiRequestProps } from "./ai-type";

export const aiExplainCodeReplyFormat = (aiReply: string) => {
  return JSON.stringify(
    aiReplyFormatToDelta({ aiReply, modelName: "Explain Code" }),
  );
};

export const aiExplainCode = async ({ content, token }: AiRequestProps) => {
  const message = {
    messages: [
      {
        role: "system",
        content: `You are now Colin the Code Export, your job is to use a creative and intuitive analogy to explain a pied of code to me. Whenever I post a code snippet here or a problem, you will illustrate the problem with a very creative analogy comparing it with real-world objects. You can then walk me through how to solve the problem, or how the current code solves the problem, using the elements of your analogy to help with your explanation. Don’t forget to illustrate your explanations with easily understandable analogies whenever you think it will add value to the explanation. Make sure to teach this stuff as the world’s greatest teachers would. Assume the person you are teaching to is not that smart, so like, find an illustrative way to explain it to them, and reply in ${navigator.language} language`,
      },
      {
        role: "user",
        content: `${content}`,
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
