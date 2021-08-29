import { ApolloServer } from "apollo-server-micro"
// import { generateClient } from "./codegen"
import { buildSchema } from "./schema"
import { Config } from "./types"

export default function nextGraphQL(config: Config = {}) {
  const { codegen, schemas, extensions = [] } = config

  return async function handler(req, res) {
    // console.log(req.method, req.url)

    if (req.method === "POST") {
      const schema = await buildSchema({ schemas, extensions })
      const apolloServer = new ApolloServer({
        schema,
        logger: console,
        introspection: true
        // introspection: process.env.NODE_ENV === "development"
      })

      await apolloServer.start()
      await apolloServer.createHandler({
        path: "/api/graphql"
      })(req, res)
    // } else if (req.method === "PUT") {
    //   const schema = await buildSchema({ schemas, extensions })
    //   await generateClient(schema, codegen)
    //   res.send("GENERATED")
    } else {
      res.send("next-graphql - WIP")
    }
  }
}
