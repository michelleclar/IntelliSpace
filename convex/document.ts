import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Fields } from "../fields";

export const archive = mutation({
    args: {id: v.id("document"), workspaceId: v.id("workspaces")},
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);

        if (!userId) throw new Error(Fields.UNAUTHORIZED);


        const exisingDocument = await ctx.db.get(args.id);
        // const exisingDocument = await ctx.db.query("document")
        //     .withIndex("by_workspace_id_user_id", q => q.eq("workspaceId", args.workspaceId)
        //         .eq("userId", userId)
        //     );

        if (!exisingDocument) {
            throw new Error("Document not found");
        }

        if (exisingDocument.userId !== userId) throw new Error(Fields.UNAUTHORIZED);

        const recursiveArchive = async (documentId: Id<"document">) => {
            const children = await ctx.db
                .query("document")
                .withIndex("by_parent_id", (q) =>
                    q.eq("parentId", documentId),
                )
                .collect();

            for (const child of children) {
                await ctx.db.patch(child._id, {
                    isArchived: true,
                });

                await recursiveArchive(child._id);
            }
        };

        const document = await ctx.db.patch(args.id, {
            isArchived: true,
        });

        await recursiveArchive(args.id);

        return document;
    },
});

export const getDocumentListIsNotArchive = query({
    args: {
        parentDocumentId: v.optional(v.id("document")),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error(Fields.UNAUTHORIZED);

        return await ctx.db
            .query("document")
            .withIndex("by_parent_id_user_id", (q) =>
                q.eq("parentId", args.parentDocumentId).eq("userId", userId),
            )
            .filter((q) => q.eq(q.field("isArchived"), false))
            .order("desc")
            .collect();
    },
});

export const create = mutation({
    args: {
        workspaceId: v.id("workspaces"),
        parentDocument: v.optional(v.id("document")),
        template: v.optional(v.id("content")),
        title: v.string()
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error(Fields.UNAUTHORIZED);

        return await ctx.db.insert("document", {
            parentId: args.parentDocument,
            content: args.template,
            userId: userId,
            title: args.title,
            workspaceId: args.workspaceId,
            isArchived: false,
            isPublished: false,
        });
    },
});

export const getTrash = query({
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error(Fields.UNAUTHORIZED);

        return await ctx.db
            .query("document")
            .withIndex("by_user_id", (q) => q.eq("userId", userId))
            .filter((q) => q.eq(q.field("isArchived"), true))
            .order("desc")
            .collect();
    },
});

export const restore = mutation({
    args: {id: v.id("document")},
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error(Fields.UNAUTHORIZED);

        const exisingDocument = await ctx.db.get(args.id);

        if (!exisingDocument) throw new Error("Document not found");

        if (exisingDocument.userId !== userId) throw new Error(Fields.UNAUTHORIZED);

        const recursiveRestore = async (documentId: Id<"document">) => {
            const children = await ctx.db
                .query("document")
                .withIndex("by_parent_id_user_id", (q) =>
                    q.eq("parentId", documentId).eq("userId", userId),
                )
                .collect();

            for (const child of children) {
                await ctx.db.patch(child._id, {
                    isArchived: false,
                });

                await recursiveRestore(child._id);
            }
        };

        const options: Partial<Doc<"document">> = {
            isArchived: false,
        };

        if (exisingDocument.parentId) {
            const parent = await ctx.db.get(exisingDocument.parentId);

            if (parent?.isArchived) {
                options.parentId = undefined;
            }
        }

        const document = await ctx.db.patch(args.id, options);

        await recursiveRestore(args.id);

        return document;
    },
});

export const remove = mutation({
    args: {id: v.id("document")},
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error(Fields.UNAUTHORIZED);

        const exisingDocument = await ctx.db.get(args.id);

        if (!exisingDocument) {
            throw new Error("Document not found");
        }

        if (exisingDocument.userId !== userId) throw new Error(Fields.UNAUTHORIZED);
        // TODO: need remove all child
        return await ctx.db.delete(args.id);
    },
});

export const getSearch = query({
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error(Fields.UNAUTHORIZED);

        return await ctx.db
            .query("document")
            .withIndex("by_user_id", q => q.eq("userId", userId))
            .filter((q) => q.eq(q.field("isArchived"), false))
            .order("desc")
            .collect();
    },
});

export const getById = query({
    args: {documentId: v.id("document")},
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error(Fields.UNAUTHORIZED);

        const document = await ctx.db.get(args.documentId);

        if (!document) throw new Error("Document not found");

        if (document.isPublished && !document.isArchived) return document;

        if (document.userId !== userId) throw new Error(Fields.UNAUTHORIZED);

        return document;
    },
});

export const update = mutation({
    args: {
        id: v.id("document"),
        content: v.optional(v.string()),
        isPublished: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error(Fields.UNAUTHORIZED);

        const {id, ...rest} = args;

        const existingDocument = await ctx.db.get(id);

        if (!existingDocument) {
            throw new Error("Document not found");
        }

        if (existingDocument.userId !== userId) {
            throw new Error("Unauthorized");
        }

        return await ctx.db.patch(args.id, {
            ...rest,
        });
    },
});
