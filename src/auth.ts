import { rule } from "next-graphql/guards"
import { getSession } from "next-auth/client"

export const authMiddleware = async (resolve, parent, args, context, info) => {
  const session = await getSession()
  // console.log("authMiddleware", { session })
  return resolve(parent, args, { ...context, session }, info)
}

export const isAuthenticated = rule()(async (parent, args, ctx, info) => {
  return ctx.session ? true : new Error("Must be logged in")
})