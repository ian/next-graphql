import { createServer } from "@graphql-yoga/node"
import { ExecuteOpts, Server, ServerConfig } from "./types"
import { buildSchema } from "./schema"

export function buildServer(config: ServerConfig): Server {
  const { plugins, ...schemaConfig } = config
  const schema = buildSchema(schemaConfig)
  const server = createServer({
    schema,
    plugins,
    context: async (context: any) => {
      if (config.session) {
        Object.assign(context, { session: await config.session(context) })
      }
      return {
        ...context,
      }
    },
    logging: {
      prettyLog: false,
      logLevel: "info",
    },
  })
  
  const execute = async (opts: ExecuteOpts) => {
    const res = await server.inject(opts)
    return res.response.json()
  }

  const executeOperation = async (req) => {
    server.handleIncomingMessage(req)
  }

  return {
    schema, 
    execute,
    executeOperation
  }
}
