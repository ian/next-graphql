import { NextApiRequest, NextApiResponse } from "next"

import { Config } from "./types"
import buildServer from "./server"
import { buildSchema } from "./schema"

export default function createGraphQLHandler({
  cors,
  typeDefs,
  resolvers,
  ...config
}: Config) {
  const schema = buildSchema({ typeDefs, resolvers })
  const server = buildServer({ ...config, schema })

  const handler = (req: NextApiRequest, res: NextApiResponse) => {
    if (cors) {
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

    console.log("GQL")
    console.log(req.body.query)
    if (req.body.variables) {
      console.log(req.body.variables)
    }
    console.log()

    return server(req, res)
  }

  return handler
}
