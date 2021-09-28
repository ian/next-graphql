import { fetch } from "cross-fetch"
import { GraphQLSchema, printSchema } from "graphql"
import { print } from "graphql"
import { introspectSchema, wrapSchema } from "@graphql-tools/wrap"
import { pruneTransformer, FilterOpts } from "./prune"

const DEFAULT_OPTS = {
  headers: {}
}

type Opts = {
  debug?: boolean
  headers?: {
    [name: string]: string
  },
  filter?: FilterOpts
}

type WrappedGraphQLSchema = GraphQLSchema & {
  originalSchema: GraphQLSchema
}

export default async function remote(
  url: string,
  opts: Opts = DEFAULT_OPTS
): Promise<WrappedGraphQLSchema> {
  const { headers: optsHeaders = {}, debug = false } = opts
  const headers = { "Content-Type": "application/json", ...optsHeaders }

  const executor = async opts => {
    const { document, variables } = opts
    const query = print(document)

    if (debug) {
      console.log(`
POST to ${url}
${query}
${variables ? JSON.stringify(variables, null, 2): ""}
`)
    }

    const json = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({ query, variables })
    }).then(res => res.json()).catch(err => {
      console.error(err)
      process.exit()
    })

    if (debug) {
      console.log("JSON", JSON.stringify(json, null, 2))
    }

    return json
  }

  const transforms = []
  const schema = await introspectSchema(executor)
  if (opts.filter) {
    transforms.push(pruneTransformer(opts.filter))
  }

  const wrapped = wrapSchema({
    schema,
    executor, 
    transforms
  }) as WrappedGraphQLSchema

  wrapped.originalSchema = wrapSchema({
    schema,
    executor, 
  })

  return wrapped
}

