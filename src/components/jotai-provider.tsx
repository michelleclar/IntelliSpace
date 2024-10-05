"use client";
import { Provider } from "jotai";
import { ReactNode } from "react";

interface JotaiProviderProps {
  children: ReactNode;
}
export const JotaiProvider = ({ children }: JotaiProviderProps) => {
  return <Provider>{children}</Provider>;
};
