import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const send = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("contactMessages", {
      ...args,
      read: false,
    });
  },
});

export const list = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("contactMessages")
      .order("desc")
      .collect();
  },
});
