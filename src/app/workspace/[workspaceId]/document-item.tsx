// import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction, useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { useGetDocuments } from "@/features/document/api/use-get-documents";
import { useDocumentId } from "@/hooks/use-document-id";

import { FileIcon } from "lucide-react";
import {
    ChevronDown,
    ChevronRight,
    LucideIcon,
    MoreHorizontal,
    Plus,
    Trash,
    Pencil,
} from "lucide-react";

import { useRouter } from "next/navigation";
// import { useCreateDocument } from "@/features/document/api/use-create-document";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

import { toast } from "sonner";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useArchiveDocument } from "@/features/document/api/use-archive-document";
// import { useCreateDocumentModal } from "@/features/document/store/use-create-document-model";
import { useUpdateDocumentModal } from "@/features/document/store/use-update-document-model";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useCreateDocument } from "@/features/document/api/use-create-document";
// const sidebarItemVariants = cva(
//   "flex items-center gap-1.5 justify-start font-normal h-7 px-[18px] text-sm overflow-hidden",
//   {
//     variants: {
//       variant: {
//         default: "text-[#f9edffcc]",
//         active: "text-[#481349] bg-white/90 hover:bg-white/90",
//       },
//     },
//     defaultVariants: {
//       variant: "default",
//     },
//   },
// );

// const calculateLeaveSpacing = (leave: number) => {
//   return `mt-${leave * 4}`;
// };

interface DocumentItemProps {
    // label: string;
    // icon: LucideIcon | IconType;
    // variant?: VariantProps<typeof sidebarItemVariants>["variant"];
    redirect?: string;
    level?: number;
    // onExpand: () => void;
    parentDocumentId?: Id<"document">;
    // active: boolean;
    // title: string;
}

export const DocumentItem = ({
                                 redirect = "",
                                 level = 0,
                                 parentDocumentId,
                             }: DocumentItemProps) => {
    const {documents} = useGetDocuments({
        parentDocumentId,
    });

    const documentId = useDocumentId();
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    const onExpand = (documentId: string) => {
        setExpanded((prevExpanded) => ({
            ...prevExpanded,
            [documentId]: !prevExpanded[documentId],
        }));
    };
    // const dynamicMarginTop = calculateLeaveSpacing(0);

    const router = useRouter();

    const onRedirect = (documentId: string) => {
        router.push(`${redirect}/${documentId}`);
    };

    return (
        <>
            <p
                style={{paddingLeft: level ? `${level * 12 + 25}px` : undefined}}
                className={cn(
                    "hidden text-sm font-medium text-muted-foreground/80",
                    expanded && "last:block",
                    level === 0 && "hidden",
                )}
            >
                No pages inside
            </p>
            {documents?.map((document) => (
                <div key={document._id}>
                    <Item
                        id={document._id}
                        onClick={() => onRedirect(document._id)}
                        label={document.title}
                        icon={FileIcon}
                        active={documentId === document._id}
                        level={level}
                        onExpand={() => onExpand(document._id)}
                        expanded={expanded[document._id]}
                    />
                    {expanded[document._id] && (
                        <DocumentItem
                            parentDocumentId={document._id}
                            level={level + 1}
                            redirect={redirect}
                        />
                    )}
                </div>
            ))}
        </>
    );
};

interface ItemProps {
    id?: Id<"document">;
    documentIcon?: string;
    active?: boolean;
    expanded?: boolean;
    isSearch?: boolean;
    level?: number;
    onExpand?: () => void;
    label: string;
    onClick?: () => void;
    icon: LucideIcon;
}

const Item = ({
                  id,
                  label,
                  onClick,
                  icon: Icon,
                  documentIcon,
                  active,
                  expanded,
                  isSearch,
                  level = 0,
                  onExpand,
              }: ItemProps) => {
    // const { mutate: createDocument } = useCreateDocument();
    const {mutate: archiveDocument} = useArchiveDocument();
    const workspaceId = useWorkspaceId();
    // const [createModelFlag, setDocumentOpen] = useCreateDocumentModal();
    const [createModelFlag, setDocumentOpen] = useState(false);
    const [updateModelFlag, setUpdateDocumentOpen] = useUpdateDocumentModal();

    const router = useRouter();
    const ChevronIcon = expanded ? ChevronDown : ChevronRight;

    const handleExpand = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    ) => {
        event.stopPropagation();
        onExpand?.();
    };

    const onArchive = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();
        if (!id) {
            return;
        }
        archiveDocument(
            {id, workspaceId},
            {
                onSuccess() {
                    toast.success("Document archive successfully");
                    if (!expanded) onExpand?.();
                    router.push(`/workspace/${workspaceId}`);
                },
                onError() {
                    toast.error("Failed to archive document");
                },
                onSettled() {
                },
            },
        );
    };

    return (
        <>

        <CreateDocumentModal open={createModelFlag} setOpen={setDocumentOpen}/>
        <div
            onClick={onClick}
            role="button"
            style={{paddingLeft: level ? `${level * 12 + 12}px` : "12px"}}
            className={cn(
                "group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium",
                active && "bg-primary/5 text-primary",
            )}
        >
            {!!id && (
                <div
                    role="button"
                    className="h-full rounded-sm hover:bg-neutral-300 dark:bg-neutral-600 mr-1"
                    onClick={handleExpand}
                >
                    <ChevronIcon className="h-4 w-4 shrink-0 text-muted-foreground/50"/>
                </div>
            )}
            {documentIcon ? (
                <div className="shrink-0 mr-2 text-[18px]">{documentIcon}</div>
            ) : (
                <Icon className="shrink-0 h-[18px] w-[18px] mr-2 text-muted-foreground"/>
            )}
            <span className="truncate">{label}</span>
            {isSearch && (
                <kbd
                    className="ml-auto pointer-events-none inline-flex select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">ctrl</span>K
                </kbd>
            )}
            {!!id && (
                <div className="ml-auto flex items-center gap-x-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} asChild>
                            <div
                                role="button"
                                className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
                            >
                                <MoreHorizontal className="h-4 w-4 text-muted-foreground"/>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-60"
                            align="start"
                            side="right"
                            forceMount
                        >
                            <DropdownMenuItem onClick={onArchive}>
                                <Trash className="h-4 w-4 mr-2"/>
                                Delete
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setUpdateDocumentOpen(!updateModelFlag)}
                            >
                                <Pencil className="h-4 w-4 mr-2"/>
                                Rename
                            </DropdownMenuItem>

                            <DropdownMenuSeparator/>
                            <div className="text-xs text-muted-foreground p-2">
                                Last edited by: user?.username
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <div
                        role="button"
                        onClick={() => setDocumentOpen(!createModelFlag)}
                        className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
                    >
                        <Plus className="h-4 w-4 text-muted-foreground"/>
                    </div>
                </div>
            )}
        </div>
        </>
    );
};

const CreateDocumentModal = ({open,setOpen}:{open:boolean,setOpen: Dispatch<SetStateAction<boolean>>}) => {
    const router = useRouter();
    const {mutate, isPending} = useCreateDocument();
    const workspaceId = useWorkspaceId();
    const documentId = useDocumentId();

    const [title, setTitleName] = useState("");
    const handleChannge = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
        setTitleName(value);
    };

    const handleClose = () => {
        setTitleName("");
        setOpen(false);
    };
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        mutate(
            {parentDocument:documentId, workspaceId,title},
            {
                onSuccess(id) {
                    toast.success("document created successfully");
                    router.push(`/workspace/${workspaceId}/document/${id}`);
                    handleClose();
                },
                onError() {
                    toast.error("Failed to create document");
                },
                onSettled() {
                },
            },
        );
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a Document</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        value={title}
                        disabled={isPending}
                        onChange={handleChannge}
                        required
                        autoFocus
                        minLength={3}
                        maxLength={80}
                        placeholder="e.g. plan-budge "
                    />
                    <div className="flex justify-end">
                        <Button disabled={isPending}>Create</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
