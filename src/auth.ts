import { rule } from "next-graphql/guards"

export const isAuthenticated = rule()(async (parent, args, ctx, info) => {
  return ctx.session ? true : new Error("Must be logged in")
})