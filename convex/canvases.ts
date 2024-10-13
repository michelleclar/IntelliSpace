import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { Fields } from "../fields";
import { v } from "convex/values";

export const getById = query({
  args: {
    id: v.id("canvases"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const canvas = await ctx.db.get(args.id);
    if (!canvas) return null;

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", canvas.workspaceId).eq("userId", userId),
      )
      .unique();
    if (!member) return null;

    return canvas;
  },
});

export const get = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId),
      )
      .unique();
    if (!member) return [];

    return await ctx.db
      .query("canvases")
      .withIndex("by_workspace_id", (q) =>
        q.eq("workspaceId", args.workspaceId),
      )
      .collect();
  },
});

export const create = mutation({
  args: { name: v.string(), workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error(Fields.UNAUTHORIZED);

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId),
      )
      .unique();
    if (!member || member.role !== "admin")
      throw new Error(Fields.UNAUTHORIZED);
    const parsedName = args.name.replace(/\s+/g, "-").toLowerCase();

    return await ctx.db.insert("canvases", {
      name: parsedName,
      workspaceId: args.workspaceId,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("canvases"),
    name: v.optional(v.string()),
    layout: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error(Fields.UNAUTHORIZED);

    const canvas = await ctx.db.get(args.id);
    if (!canvas) throw new Error("Canvas not found");

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", canvas.workspaceId).eq("userId", userId),
      )
      .unique();
    if (!member || member.role !== "admin")
      throw new Error(Fields.UNAUTHORIZED);

    console.log({ layout: args.layout });
    if (args.layout) {
      await ctx.db.patch(args.id, { layout: args.layout });
    }
    if (args.name) {
      await ctx.db.patch(args.id, { name: args.name });
    }

    return args.id;
  },
});

export const remove = mutation({
  args: {
    id: v.id("canvases"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error(Fields.UNAUTHORIZED);
    const canvas = await ctx.db.get(args.id);
    if (!canvas) throw new Error("Canvas not found");

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", canvas.workspaceId).eq("userId", userId),
      )
      .unique();
    if (!member || member.role !== "admin")
      throw new Error(Fields.UNAUTHORIZED);

    await ctx.db.delete(args.id);

    return args.id;
  },
});
