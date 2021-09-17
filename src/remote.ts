import { GraphQLSchema } from "graphql"
import { fetch } from "cross-fetch"
import { print } from "graphql"
import { introspectSchema, wrapSchema } from "@graphql-tools/wrap"
import prune, { PruneOpts } from "./prune"

const DEFAULT_OPTS = {
  headers: {}
}

type Opts = {
  debug?: boolean
  headers?: {
    [name: string]: string
  },
  prune?: PruneOpts
}

export default async function remote(
  url: string,
  opts: Opts = DEFAULT_OPTS
): Promise<GraphQLSchema> {
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
    }).then(res => res.json())

    if (debug) {
      console.log("JSON", JSON.stringify(json, null, 2))
    }

    return json
  }

  let schema = await introspectSchema(executor)
  if (opts.prune) {
    schema = prune(schema, opts.prune)
  }

  return wrapSchema({
    schema,
    executor
  })
}

