import { rule, shield } from "graphql-shield"
import { Guards } from "./types"

export function guardsMiddleware(guards: Guards) {
  return shield(guards, {
    fallbackError: "Error Occurred"
  }
  //   ,{
  //   fallbackError: async (thrownThing, parent, args, context, info) => {
  //     console.log({thrownThing, parent})
  //     return new Error("Error Occurred")
  //     // if (thrownThing instanceof ApolloError) {
  //     //   // expected errors
  //     //   return thrownThing
  //     // } else if (thrownThing instanceof Error) {
  //     //   // unexpected errors
  //     //   console.error(thrownThing)
  //     //   await Sentry.report(thrownThing)
  //     //   return new ApolloError('Internal server error', 'ERR_INTERNAL_SERVER')
  //     // } else {
  //     //   // what the hell got thrown
  //     //   console.error('The resolver threw something that is not an error.')
  //     //   console.error(thrownThing)
  //     //   return new ApolloError('Internal server error', 'ERR_INTERNAL_SERVER')
  //     // }
  //   },

  // }
  )
}

export { rule, and, not, or, shield } from "graphql-shield"