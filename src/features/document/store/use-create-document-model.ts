import { atom, useAtom } from "jotai";

const modalState = atom(false);

export function useCreateDocumentModal() {
  return useAtom(modalState);
}
