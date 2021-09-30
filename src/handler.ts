import { Config } from "./types"
import { buildServer } from "./server"

function handler(config: Config = {}) {
  return async function handler(req, res) {
    if (config.cors) {
      res.header("Access-Control-Allow-Origin", "*")
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
      )

      if (req.method == "OPTIONS") {
        res.header(
          "Access-Control-Allow-Methods",
          "PUT, POST, PATCH, DELETE, GET"
        )
        return res.status(200).json({})
      }
    }

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
