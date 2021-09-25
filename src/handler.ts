import { Config } from "./types"
import { buildServer } from "./server"
import { addSessionToContext } from "./middleware"

function handler(config: Config = {}) {
  return async function handler(req, res) {
    if (req.method === "POST") {
      if (config.session) {
        config.middleware = [
          addSessionToContext(config.session({ req })), 
          ...config.middleware
        ]
      }
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