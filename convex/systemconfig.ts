import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Fields } from "../fields";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error(Fields.UNAUTHORIZED);

    return await ctx.db.query("systemconfig").unique();
  },
});
