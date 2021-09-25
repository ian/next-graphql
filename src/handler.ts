import { Config } from "./types"
import { buildServer } from "./server"

function handler(config: Config = {}) {
  return async function handler(req, res) {
    if (req.method === "POST") {
      const server = await buildServer(config)
      const handler = server.createHandler({
        path: "/api/graphql",
      })
      
      await handler(req, res)
    } else {
      res.send("next-graphql - WIP")
    }
  }
}

export default handler