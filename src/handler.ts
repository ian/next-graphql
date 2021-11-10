import { renderPlaygroundPage } from "graphql-playground-html"
import type { NextApiRequest, NextApiResponse } from "next"
import { Config } from "./types"
import { buildServer } from "./server"

function handler(config: Config = {}) {
  return async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (config.cors) {
      res.setHeader("Access-Control-Allow-Origin", "*")
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
      )

      if (req.method == "OPTIONS") {
        res.setHeader(
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
      res.setHeader("Content-Type", "text/html")
      res.send(
        renderPlaygroundPage({
          endpoint: `/api/graphql`,
        })
      )
      res.status(200)
    }
  }
}

export default handler
