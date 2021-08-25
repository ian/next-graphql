import { rule, shield } from "graphql-shield"

export const isAuthenticated = rule({ cache: "contextual" })(
  async (parent, args, ctx, info) => {
    return ctx.user !== null
  }
)

export const isAdmin = rule({ cache: "contextual" })(
  async (parent, args, ctx, info) => {
    return ctx.user.role === "admin"
  }
)

export const isEditor = rule({ cache: "contextual" })(
  async (parent, args, ctx, info) => {
    return ctx.user.role === "editor"
  }
)

export { and, not, or, shield } from "graphql-shield"
