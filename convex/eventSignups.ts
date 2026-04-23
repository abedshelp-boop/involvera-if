import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const signup = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    age: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("eventSignups", args);
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("eventSignups").order("desc").collect();
  },
});
