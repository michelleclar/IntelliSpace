import { atom, useAtom } from "jotai";

const modalState = atom(false);

export function useCreateChatbotModal() {
  return useAtom(modalState);
}
