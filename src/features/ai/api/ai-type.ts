export interface AiReply {
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

export interface AiRequestProps {
  content: string;
  token: string;
}
