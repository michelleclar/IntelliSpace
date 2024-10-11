"use client";

import {useGetWorkspaces} from "@/features/workspaces/api/use-get-workspaces";
import {useCreateWorkspaceModal} from "@/features/workspaces/store/use-create-workspace-model";
import {useRouter} from "next/navigation";
import {useEffect, useMemo} from "react";
import {Loader} from "lucide-react";

export default function Home() {
    const router = useRouter();
    const [open, setOpen] = useCreateWorkspaceModal();
    const {workspaces, isLoading} = useGetWorkspaces();
    const workspaceId = useMemo(() => workspaces?.[0]?._id, [workspaces]);
    useEffect(() => {
        if (isLoading) return;
        if (workspaceId) {
            router.replace(`/workspace/${workspaceId}`);
        } else if (!open) {
            setOpen(true);
        }
    }, [workspaceId, isLoading, open, setOpen, router]);

    return (
        <div className="h-full flex items-center justify-center">
            <Loader className="size-6 animate-spin text-muted-foreground"/>
        </div>
    );
}
