import { useDisableIntrospection as DisableIntrospection } from "@envelop/disable-introspection"
import { createServer } from "@graphql-yoga/node"

import { extendSchema } from "./schema"
import { ServerConfig } from "./types"

export default function buildServer(config: ServerConfig): any {
  const { schema, guards, session } = config

  const options = {
    context: async (context: any) => {
      if (session) {
        Object.assign(context, { session: await session(context) })
      }
      return {
        ...context,
      }
    },

    schema: extendSchema({
      schema,
      guards,
    }),
  }

  if (process.env.NODE_ENV === "development") {
    Object.assign(options, {
      graphiql: true,
    })
  } else {
    Object.assign(options, {
      graphiql: false,
      plugins: [DisableIntrospection()],
    })
  }

  return createServer(options)
}
