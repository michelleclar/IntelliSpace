// import { Ollama } from "ollama";

/*
curl -X POST "https://models.inference.ai.azure.com/chat/completions" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $GITHUB_TOKEN" \
    -d '{
        "messages": [
            {
                "role": "system",
                "content": "You are a helpful assistant."
            },
            {
                "role": "user",
                "content": "What is the capital of France?"
            }
        ],
        "temperature": 1.0,
        "top_p": 1.0,
        "max_tokens": 1000,
        "model": "gpt-4o-mini"
    }'

*/
const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
// "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";
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

export interface Root {
  choices: Choice[];
  created: number;
  id: string;
  model: string;
  object: string;
  system_fingerprint: string;
  usage: Usage;
}

export interface Choice {
  finish_reason: string;
  index: number;
  message: Message;
}

export interface Message {
  content: string;
  role: string;
}

export interface Usage {
  completion_tokens: number;
  prompt_tokens: number;
  total_tokens: number;
}
export const useTranslateText = async (content: string) => {
  // Ollama.generate()
  // const ollama = new Ollama({ host: "http://127.0.0.1:11434" });
  // const response = await Ollama.generate({
  //   model: "llama3.1",
  //   prompt: content,
  // });
  if (content.replace(/<(.|\n)*?/g, "").trim().length === 0) {
    return void 0;
  }
  const message = {
    messages: [
      {
        role: "system",
        content: "You are a translation assistant.",
      },
      {
        role: "user",
        content: `Translate the following text to ${navigator.language}: "${content}".`,
      },
    ],
    temperature: 1.0,
    top_p: 1.0,
    max_tokens: 1000,
    model: "gpt-4o-mini",
  };
  const r = await fetch(
    "https://models.inference.ai.azure.com/chat/completions",
    { ...DefaultOptions, body: JSON.stringify(message) },
  );
  if (r.ok) {
    const choices: Root = await r.json();
    return choices.choices[0];
  }

  return void 0;
};
