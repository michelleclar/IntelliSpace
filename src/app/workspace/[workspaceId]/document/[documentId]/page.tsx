"use client";

import "iframe-resizer/js/iframeResizer.contentWindow";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { BlockEditor } from "@/components/editor/components/BlockEditor";
import { createPortal } from "react-dom";
import { Surface } from "@/components/editor/components/ui/Surface";
import { Toolbar } from "@/components/editor/components/ui/Toolbar";
import { Icon } from "@/components/editor/components/ui/Icon";
import { useCollaboration } from "@/hooks/use-collaboration";
import { useUpdateDocument } from "@/features/document/api/use-update-document";
import { useDocumentId } from "@/hooks/use-document-id";
import { toast } from "sonner";
import { useGetDocument } from "@/features/document/api/use-get-document";
import { Loader } from "lucide-react";

const useDarkmode = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : false,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => setIsDarkMode(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = useCallback(
    () => setIsDarkMode((isDark) => !isDark),
    [],
  );
  const lightMode = useCallback(() => setIsDarkMode(false), []);
  const darkMode = useCallback(() => setIsDarkMode(true), []);

  return {
    isDarkMode,
    toggleDarkMode,
    lightMode,
    darkMode,
  };
};

export default function Document({ params }: { params: { room: string } }) {
  const { isDarkMode, darkMode, lightMode } = useDarkmode();
  // const [aiToken, setAiToken] = useState<string | null | undefined>();

  const { mutate} = useUpdateDocument();
  const documentId = useDocumentId();
  const { data: _document, isLoading: isLoadingDocument } = useGetDocument({
    documentId,
  });
  const searchParams = useSearchParams();
  const providerState = useCollaboration({
    docId: params.room,
    enabled: parseInt(searchParams?.get("noCollab") as string) !== 1,
  });
  // TODO: need show all user document,
  //  Tips: 1 other user doc need isArchived false
  //        2 other user doc need isPublished false
  // TODO: only manipulate own doc
  // TODO: trash only show self doc

  // useEffect(() => {
  //   // fetch data
  //   const dataFetch = async () => {
  //     try {
  //       const response = await fetch("/api/ai", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       });
  //
  //       if (!response.ok) {
  //         throw new Error(
  //           "No AI token provided, please set TIPTAP_AI_SECRET in your environment",
  //         );
  //       }
  //       const data = await response.json();
  //
  //       const { token } = data;
  //
  //       // set state when the data received
  //       setAiToken(token);
  //     } catch (e) {
  //       if (e instanceof Error) {
  //         console.error(e.message);
  //       }
  //       setAiToken(null);
  //       return;
  //     }
  //   };
  //
  //   dataFetch();
  // }, []);
  const onUpdate = (content: string) => {
    mutate(
      { content, id: documentId },
      {
        onSuccess: () => {
          toast.success(`update document success`);
        },
      },
    );
  };

  if (providerState.state === "loading" || aiToken === undefined) return;
  if (isLoadingDocument) {
    return (
      <div className="h-full flex-1 flex items-center justify-center">
        <Loader className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const DarkModeSwitcher = createPortal(
    <Surface className="flex items-center gap-1 fixed bottom-6 right-6 z-[99999] p-1">
      <Toolbar.Button onClick={lightMode} active={!isDarkMode}>
        <Icon name="Sun" />
      </Toolbar.Button>
      <Toolbar.Button onClick={darkMode} active={isDarkMode}>
        <Icon name="Moon" />
      </Toolbar.Button>
    </Surface>,
    document.body,
  );

  return (
    <>
      {DarkModeSwitcher}
      <BlockEditor
        aiToken={aiToken ?? undefined}
        ydoc={providerState.yDoc}
        provider={providerState.provider}
        initialContent={_document?.content}
        onUpdate={onUpdate}
      />
    </>
  );
}
