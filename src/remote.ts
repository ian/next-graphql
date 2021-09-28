import { fetch } from "cross-fetch"
import { GraphQLSchema } from "graphql"
import { print } from "graphql"
import { introspectSchema, wrapSchema } from "@graphql-tools/wrap"
import { prune, filter, FilterOpts } from "./transform"

const DEFAULT_OPTS = {
  headers: {},
}

type Opts = {
  debug?: boolean
  headers?: {
    [name: string]: string
  }
  filter?: FilterOpts
  prune?: boolean
}

type WrappedGraphQLSchema = GraphQLSchema & {
  originalSchema: GraphQLSchema
}

export default async function remote(
  url: string,
  opts: Opts = DEFAULT_OPTS
): Promise<WrappedGraphQLSchema> {
  const {
    headers: optsHeaders = {},
    filter: optsFilter,
    prune: optsPrune = true,
    debug = false,
  } = opts
  const headers = { "Content-Type": "application/json", ...optsHeaders }

  const executor = async (opts) => {
    const { document, variables } = opts
    const query = print(document)

    if (debug) {
      console.log(`
POST to ${url}
${query}
${variables ? JSON.stringify(variables, null, 2) : ""}
`)
    }

    const json = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({ query, variables }),
    })
      .then((res) => res.json())
      .catch(console.error)

    if (debug) {
      console.log("JSON", JSON.stringify(json, null, 2))
    }

    return json
  }

  const introspected = await introspectSchema(executor)
  const originalSchema = wrapSchema({
    schema: introspected,
    executor,
  }) as WrappedGraphQLSchema

  let schema

  if (optsFilter) {
    schema = filter(originalSchema, optsFilter)
  } else {
    schema = originalSchema
  }

  if (optsPrune) {
    // This is super annoying, but this requires a double prune.
    // Otherwise, we end up with dangling subscription / mutations with no properties
    schema = prune(prune(schema)) as WrappedGraphQLSchema
  }

  schema.originalSchema = originalSchema

  return schema
}
