import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { mutation, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Fields } from "../fields";
//emoji message
const getMeamber = async (
  ctx: QueryCtx,
  workspaceId: Id<"workspaces">,
  userId: Id<"users">,
) => {
  return ctx.db
    .query("members")
    .withIndex("by_workspace_id_user_id", (q) =>
      q.eq("workspaceId", workspaceId).eq("userId", userId),
    )
    .unique();
};

export const toggle = mutation({
  args: { value: v.string(), messageId: v.id("messages") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error(Fields.UNAUTHORIZED);

    const message = await ctx.db.get(args.messageId);
    if (!message) {
      throw new Error("message not found");
    }

    const member = await getMeamber(ctx, message.workspaceId, userId);

    if (!member) {
      throw new Error(Fields.UNAUTHORIZED);
    }

    const exsitingMessageReactionFromUser = await ctx.db
      .query("reactions")
      .filter((q) =>
        q.and(
          q.eq(q.field("messageId"), args.messageId),
          q.eq(q.field("memberId"), member._id),
          q.eq(q.field("value"), args.value),
        ),
      )
      .first();

    if (exsitingMessageReactionFromUser) {
      await ctx.db.delete(exsitingMessageReactionFromUser._id);
      return exsitingMessageReactionFromUser._id;
    } else {
      const newReactionsId = await ctx.db.insert("reactions", {
        value: args.value,
        memberId: member._id,
        messageId: message._id,
        workspaceId: message.workspaceId,
      });
      return newReactionsId;
    }
  },
});
