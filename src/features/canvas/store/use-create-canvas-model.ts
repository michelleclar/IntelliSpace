import { atom, useAtom } from "jotai";

const modalState = atom(false);

export function useCreateCanvasModal() {
  return useAtom(modalState);
}
