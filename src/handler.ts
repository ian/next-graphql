import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import { Config } from "./types"
import { buildServer } from "./server"

// function handler(config: Config = {}) {
//   return async function handler(req: NextApiRequest, res: NextApiResponse) {
//     if (config.cors) {
//       res.setHeader("Access-Control-Allow-Origin", "*")
//       res.setHeader(
//         "Access-Control-Allow-Headers",
//         "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//       )

//       if (req.method == "OPTIONS") {
//         res.setHeader(
//           "Access-Control-Allow-Methods",
//           "PUT, POST, PATCH, DELETE, GET"
//         )
//         return res.status(200).json({})
//       }
//     }

//     if (req.method === "POST") {
//       const server = await buildServer(config)
//       const handler = server.createHandler({
//         path: "/api/graphql",
//       })

//       await handler(req, res)
//     } else {
//       res.send("next-graphql - WIP")
//     }
//   }
// }

function handler(config: Config = {}) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const server = await buildServer(config)

    // const reply = await server.inject({
    //   // @ts-ignore
    //   method: req.method,
    //   payload: req.body,
    //   headers: req.headers,
    //   cookies: req.cookies,
    //   query: req.query,
    //   url: req.url,
    // })
    // const { headers } = reply

    // for (const headerKey in headers) {
    //   const header = headers[headerKey]!
    //   res.setHeader(headerKey, header)
    // }

    // // res.status(statusCode)
    // // res.end(rawPayload)
    // console.log({ reply })
    res.end()
  }
}

export default handler
