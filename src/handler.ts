import { Config } from "./types"
import { buildServer } from "./server"

export default function nextGraphQL(config: Config = {}) {
  const { schemas, extensions = [] } = config

  return async function handler(req, res) {
    if (req.method === "POST") {
      const server = await buildServer({ schemas, extensions })
      const handler = server.createHandler({
        path: "/api/graphql",
      })
      
      await handler(req, res)
    } else {
      res.send("next-graphql - WIP")
    }
  }
}
