import { introspectSchema } from "@graphql-tools/wrap"
import { fetch } from "cross-fetch"
import { print } from "graphql"
import { SubschemaConfig } from "@graphql-tools/delegate"

const DEFAULT_OPTS = {
  headers: {}
}

type Opts = {
  headers?: {
    [name: string]: string
  }
}

export default async function remote(
  url: string,
  opts: Opts = DEFAULT_OPTS
): Promise<SubschemaConfig> {
  const { headers: optsHeaders = {} } = opts
  const headers = { "Content-Type": "application/json", ...optsHeaders }

  const executor = async opts => {
    const { document, variables } = opts
    const query = print(document)

    if (process.env.NEXT_GRAPHQL_DEBUG) {
      console.log(`
POST to ${url}
${query}
${variables}
`)
    }

    const json = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({ query, variables })
    }).then(res => res.json())

    // console.log("JSON", JSON.stringify(json, null, 2))

    return json
  }

  return {
    schema: await introspectSchema(executor),
    executor
  }
}
