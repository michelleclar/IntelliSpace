"use client";
import {
    Excalidraw,
} from "@excalidraw/excalidraw";
import {
    ExcalidrawImperativeAPI,
    type ExcalidrawInitialDataState,
} from "@excalidraw/excalidraw/types/types";
import {MutableRefObject} from "react";
import {Id} from "../../convex/_generated/dataModel";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {useUpdateCanvas} from "@/features/canvas/api/use-update-canvas";
import {toast} from "sonner";

// import "@excalidraw/excalidraw/index.css";
type CanvasValue = {
    layout: string;
    body: string;
};

interface CanvasProps {
    variant?: "create" | "update";
    defaultValue?: ExcalidrawInitialDataState;
    disabled?: boolean;
    innerRef: MutableRefObject<ExcalidrawImperativeAPI | null>;
    id: Id<"canvases">;
    onSave?: ({layout, body}: CanvasValue) => void;
}

// export interface ExcalidrawProps {
//     onChange?: (elements: readonly ExcalidrawElement[], appState: AppState, files: BinaryFiles) => void;
//     initialData?: ExcalidrawInitialDataState | null | Promise<ExcalidrawInitialDataState | null>;
//     excalidrawAPI?: (api: ExcalidrawImperativeAPI) => void;
//     isCollaborating?: boolean;
//     onPointerUpdate?: (payload: {
//         pointer: {
//             x: number;
//             y: number;
//             tool: "pointer" | "laser";
//         };
//         button: "down" | "up";
//         pointersMap: Gesture["pointers"];
//     }) => void;
//     onPaste?: (data: ClipboardData, event: ClipboardEvent | null) => Promise<boolean> | boolean;
//     renderTopRightUI?: (isMobile: boolean, appState: UIAppState) => JSX.Element | null;
//     langCode?: Language["code"];
//     viewModeEnabled?: boolean;
//     zenModeEnabled?: boolean;
//     gridModeEnabled?: boolean;
//     objectsSnapModeEnabled?: boolean;
//     libraryReturnUrl?: string;
//     theme?: Theme;
//     name?: string;
//     renderCustomStats?: (elements: readonly NonDeletedExcalidrawElement[], appState: UIAppState) => JSX.Element;
//     UIOptions?: Partial<UIOptions>;
//     detectScroll?: boolean;
//     handleKeyboardGlobally?: boolean;
//     onLibraryChange?: (libraryItems: LibraryItems) => void | Promise<any>;
//     autoFocus?: boolean;
//     generateIdForFile?: (file: File) => string | Promise<string>;
//     onLinkOpen?: (element: NonDeletedExcalidrawElement, event: CustomEvent<{
//         nativeEvent: MouseEvent | React.PointerEvent<HTMLCanvasElement>;
//     }>) => void;
//     onPointerDown?: (activeTool: AppState["activeTool"], pointerDownState: PointerDownState) => void;
//     onScrollChange?: (scrollX: number, scrollY: number) => void;
//     children?: React.ReactNode;
//     validateEmbeddable?: boolean | string[] | RegExp | RegExp[] | ((link: string) => boolean | undefined);
//     renderEmbeddable?: (element: NonDeleted<ExcalidrawEmbeddableElement>, appState: AppState) => JSX.Element | null;
// }

const Canvas = ({
                    defaultValue,
                    innerRef,
                    id,
                }: CanvasProps) => {
    const {mutate, isPending} = useUpdateCanvas();
    const handleUpload = () => {
        const appState = innerRef.current?.getAppState();
        const elements = innerRef.current?.getSceneElements();
        const files = innerRef.current?.getFiles();
        const layout = JSON.stringify({appState, elements, files});

        mutate(
            {id, layout},
            {
                onSuccess: () => {
                    toast.success("upload success");
                },
                onError: () => {
                    toast.error("Flied upload");
                },
            },
        );
    };
    return (
        <Excalidraw
            initialData={defaultValue}
            onChange={(elements, appState, files) => {
                if (!elements || !elements.length) {
                    return;
                }
                const value = {elements, appState, files};
                localStorage.setItem(id, JSON.stringify(value));
                console.log(appState.theme);
            }}
            excalidrawAPI={(api) => (innerRef.current = api)}
            renderTopRightUI={() => {
                return (
                    <Button
                        variant={"ghost"}
                        onClick={handleUpload}
                        className={cn(
                            "text-sm",
                            innerRef.current?.getAppState().theme === "light"
                                ? "bg-[#ECECF4] text-[#1B1B1F]"
                                : "bg-[#232329] text-[#E3E3E8]",
                        )}
                        disabled={isPending}
                    >
                        upload
                    </Button>
                );
            }}
        />
    );
};

export default Canvas;
