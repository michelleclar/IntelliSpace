"use client";
import dynamic from "next/dynamic";
import { useRef } from "react";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types";
import { useCanvasId } from "@/hooks/use-canvas-id";
import { Header } from "@/app/workspace/[workspaceId]/canvas/[canvasId]/header";
import { useGetCanvas } from "@/features/canvas/api/use-get-canvas";
import { Loader, TriangleAlert } from "lucide-react";

export default function Home() {
  const id = useCanvasId();
  const { canvas, isLoading: canvasIsLoading } = useGetCanvas({ id });
  const Canvas = dynamic(
    async () => (await import("@/components/canvas")).default,
    {
      ssr: false,
    },
  );

  const canvasRef = useRef<ExcalidrawImperativeAPI | null>(null);
  if (canvasIsLoading) {
    return (
      <div className="h-full flex-1 flex items-center justify-center">
        <Loader className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!canvas) {
    return (
      <div className="h-full flex-1 flex flex-col gap-y-2 items-center justify-center">
        <TriangleAlert className="size-5 text-muted-foreground" />
        <span className="text-muted-foreground  text-sm">
          Channel not fount
        </span>
      </div>
    );
  }
  console.log(canvas.layout);
  const localLayout = localStorage.getItem(id);
  console.log(localLayout);

  return (
    <div className="flex-col flex h-full">
      <Header id={id} title={canvas?.name} />
      <Canvas
        defaultValue={
          localLayout === null
            ? canvas.layout === undefined
              ? null
              : JSON.parse(canvas.layout)
            : JSON.parse(localLayout)
        }
        innerRef={canvasRef}
        id={id}
      />
    </div>
  );
}
