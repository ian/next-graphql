import { shield } from "graphql-shield"
import { Guards } from "./types"

export function guardsMiddleware(guards: Guards) {
  return shield(guards, {
    fallbackError: async (thrownThing, parent, args, context, info) => {
      console.error({ thrownThing, parent, args, info })
      return new Error("Error Occurred")
    },
  })
}

export { rule, and, not, or, allow, deny } from "graphql-shield"
