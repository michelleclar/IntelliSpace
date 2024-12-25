"use client";
import { Id, Doc } from "../../../../../../convex/_generated/dataModel";
import { cn } from "@/lib/utils";


interface DocumentListProps {
    parentDocumentId?: Id<"document">;
    level?: number;
    data?: Doc<"document">[];
}

export const DocumentList = ({
                                 parentDocumentId,
                                 level = 0,
                             }: DocumentListProps) => {

    console.log(parentDocumentId);
    console.log(level);
    return (
        <>
            {/*<div*/}
            {/*    onClick={onClick}*/}
            {/*    role="button"*/}
            {/*    style={{paddingLeft: level ? `${level * 12 + 12}px` : "12px"}}*/}
            {/*    className={cn(*/}
            {/*        "group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium",*/}
            {/*        active && "bg-primary/5 text-primary",*/}
            {/*    )}*/}
            {/*></div>*/}
        </>
    );
};