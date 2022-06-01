import { useDisableIntrospection as DisableIntrospection } from "@envelop/disable-introspection"
import { makeExecutableSchema } from "@graphql-tools/schema"
import { createServer } from "@graphql-yoga/node"

import { buildSchema } from "./schema"
import { ServerConfig } from "./types"

export default function buildServer(config: ServerConfig): any {
  const { typeDefs, resolvers, guards, session } = config

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  })

  const options = {
    // context: async (context: any) => {
    //   if (session) {
    //     Object.assign(context, { session: await session(context) })
    //   }
    //   return {
    //     ...context,
    //   }
    // },

    schema: buildSchema({
      schema,
      guards,
    }),
    // schema,
  }

  // if (process.env.NODE_ENV === "development") {
  //   Object.assign(options, {
  //     graphiql: true,
  //   })
  // } else {
  //   Object.assign(options, {
  //     graphiql: false,
  //     plugins: [DisableIntrospection()],
  //   })
  // }

  return createServer(options)
}
