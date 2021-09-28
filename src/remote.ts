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

  if (opts.filter) {
    // This is super annoying, but this requires a double prune.
    // Otherwise, we end up with dangling subscription / mutations with no properties
    schema = prune(
      prune(filter(originalSchema, opts.filter))
    ) as WrappedGraphQLSchema
  } else {
    schema = originalSchema
  }

  schema.originalSchema = originalSchema

  return schema

  // if (opts.filter) {
  //   schema = prune() // as WrappedGraphQLSchema
  // }

  // schema.originalSchema = wrapSchema({
  //   schema,
  //   executor,
  // })

  // const transforms = []
  // const schema = await introspectSchema(executor)

  // if (opts.filter) {
  //   transforms.push(filterTransformer(opts.filter))
  //   transforms.push(pruneTransformer())
  // }

  // const filtered = wrapSchema({
  //   schema,
  //   executor,
  //   transforms,
  // }) as WrappedGraphQLSchema

  // const pruned = pruneSchema(filtered)
  // console.log({ pruned })

  // filtered.originalSchema = wrapSchema({
  //   schema,
  //   executor,
  // })

  // return filtered
}
