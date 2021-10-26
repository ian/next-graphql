# Overview

NextGraphQL.js is a zero-config [GraphQL](https://graphql.org) server for [Next.js](https://nextjs.org/), supporting Vercel Serverless environment runtime.

# Features

- Easily add any number of GraphQLSchemas together.
- Built-in support for [NextAuth](https://github.com/nextauthjs/next-auth)
- Schema merging + stitching
- Remote schemas + pruning
- Extensions
- Guards on Endpoints + Properties
- ... and more soon, let us know what features you need!

# Examples

## Nexus

It's really easy to build a schema using Nexus and NextGraphQL:

```ts
// pages/api/graphql.ts

import { extendType, objectType, makeSchema } from "nexus"
import { handler as nextGraphQLHandler } from "next-graphql"

export const config = {
  api: {
    bodyParser: false,
  },
}

const Query = extendType({
  type: "Query",
  definition(t) {
    t.field("hello", {
      type: "String",
      resolve() {
        return "Hello, world"
      },
    })
  },
})

const nexus = makeSchema({
  types: [Query],
})

export default nextGraphQLHandler({
  schemas: {
    nexus,
  },
})
```

For a complete example, see [examples/nexus](./examples/nexus).

## NextAuth

One of the main motivations behind this project was to provide a more integrated experience with GraphQL and Authentication.

Most BaaS services provide some sort of authentication capabilities but having deep auth integration with your project is beneficial.

Adding [NextAuth](https://github.com/nextauthjs/next-auth) is a few lines of code.

```ts
// pages/api/graphql.ts

import { getSession } from "next-auth/client"
import { handler as nextGraphQLHandler } from "next-graphql"

export const config = {
  api: {
    bodyParser: false,
  },
}

export default nextGraphQLHandler({
  session: ({ req }) => getSession({ req })
  schemas: {
    // ...
  }
})
```

This will add a `{session}` object to the resolver context.

### Authentication Guards

You can easily guard content:

```ts

// pages/api/graphql.ts

import { getSession } from "next-auth/client"
import { handler as nextGraphQLHandler } from "next-graphql"
import { isAuthenticated } from "next-graphql/auth"

export const config = {
  api: {
    bodyParser: false,
  },
}

export default nextGraphQLHandler({
  session: ({ req }) => getSession({ req })
  schemas: {
    // ...
  },
  guards: {
    Query: {
      myQuery: isAuthenticated
    }
  }
})
```

## Remote Schemas

Remote schemas are a first-class citizen in NextGraphQL. By default all schemas are merged and stitched together creating a primary, "gateway" schema.

For a full working remote example, see see [examples/remote](./examples/remote)

### Basic remote schema

This will add the [SpaceX GraphQL](https://api.spacex.land/graphql) endpoints:

```ts
// pages/api/graphql.ts
import { handler as nextGraphQLHandler, remote } from "next-graphql"

export const config = {
  api: {
    bodyParser: false,
  },
}

export default nextGraphQLHandler({
  schemas: {
    spacex: remote("https://api.spacex.land/graphql"),
  },
})
```

### Guarding remote schema endpoints

Now suppose that you want to guard some of the endpoints in the remote schema:

```ts
// pages/api/graphql.ts

import { handler as nextGraphQLHandler, remote } from "next-graphql"
import { rule } from "next-graphql/guards"

const fiftyPercentFailWithError = rule()(async (parent, args, ctx, info) => {
  return Math.floor(Math.random() * 100) % 2 === 0
    ? true
    : new Error("You were randomly selected to have this endpoint fail.")
})

export const config = {
  api: {
    bodyParser: false,
  },
}

export default nextGraphQLHandler({
  schemas: {
    spacex: remote("https://api.spacex.land/graphql"),
  },
  guards: {
    Query: {
      ships: fiftyPercentFailWithError,
    },
  },
})
```

### Custom headers/authentication

Suppose you want to add an authorized endpoint, i.e. [GraphCMS](https://graphcms.com):

```ts
// pages/api/graphql.ts

import { handler as nextGraphQLHandler, remote } from "next-graphql"

export const config = {
  api: {
    bodyParser: false,
  },
}

export default nextGraphQLHandler({
  schemas: {
    graphcms: remote(process.env.GRAPHCMS_URL, {
      headers: {
        Authorization: "Bearer " + process.env.GRAPHCMS_TOKEN,
      },
    }),
  },
})
```

### Filtering remote schemas

Sometimes we want to alter the upstream schema. This removes all references to Ship, which will also filter and prune the final schema removing all unused types from the gateway schema.

```ts
// pages/api/graphql.ts

import { handler as nextGraphQLHandler, remote, helpers } from "next-graphql"

export const config = {
  api: {
    bodyParser: false,
  },
}

export default nextGraphQLHandler({
  schemas: {
    spacex: remote("https://api.spacex.land/graphql", {
      filter: {
        types: helpers.onlyTypes("Ship"),
      },
    }),
  },
})
```

# Extensions

NextGraphQL supports an Extension format to make it easy for submodule development:

```ts
// pages/api/graphql.ts

import { handler as nextGraphQLHandler, remote } from "next-graphql"

export const config = {
  api: {
    bodyParser: false,
  },
}

const customExtender = {
  resolvers: {
    Query: {
      ships: async (obj, args, context) => {
        return getDataFromOtherSource() // custom override resolver
      },
    },
  },
}

export default nextGraphQLHandler({
  schemas: {
    spacex: remote("https://api.spacex.land/graphql"),
  },
  extensions: [customExtender],
})
```

Extensions support the following options:

```ts
export type Extension = {
  typeDefs?: string
  resolvers?: {
    [key: string]: any
  }
  middleware?: Middleware | Middleware[]
  guards?: Guards
}
```

# Acknowledgements

NextGraphQL is a new project but we're super grateful to all our contributors as we expand and built out the project.

<a href="https://github.com/ian/next-graphql/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=ian/next-graphql" />
</a>

We'd also like to make a massive shoutout to [the Guild](https://the-guild.dev/) team for their contributions to GraphQL, without which this project wouldn't exist.

# License

MIT

<!-- # Project Structure

The `init` command will add the following to to your project structure:

```
./{nextroot}
│
├── graphql
│   ├── client
│   │   ├── fragments.graphql
│   │   ├── operations.graphql
│   │   └── codegen.yml
│   └── server
│       ├── overrides.ts
│       └── config.ts
└── pages
    ├── api
    │   └── graphql.ts
    └── ...
```

`./graphql/client`

This is the base directory for the [graphql-code-generator](https://www.graphql-code-generator.com/) configuration.

Feel free to organize this folder however you'd like, fragments + operations files are a suggestions. All configuration is run off the codegen.yml so make sure edit this file if you make changes to the folder structure.

NextGraphQL.js seeks to simply setup the structure for code generation, but remains unopinionated on the matter of picking a frontend GraphQL client.

The repository author's personal favorite is URQL. Provides idiomatic integrations into React, Svelte, and Vue and is really easy to use.

- [urql](https://formidable.com/open-source/urql/) -- see [plugin for URQL](https://www.graphql-code-generator.com/docs/plugins/typescript-urql)

Other suggestions:

- [graphql-request](https://github.com/prisma-labs/graphql-request) -- see [plugin for GraphQL-Request](https://www.graphql-code-generator.com/docs/plugins/typescript-graphql-request)
- [React Query](https://react-query.tanstack.com/) -- see [plugin for React-Query](https://www.graphql-code-generator.com/docs/plugins/typescript-react-query)
- [Apollo](https://www.apollographql.com/docs/react/) -- see [plugin for Apollo](https://www.graphql-code-generator.com/docs/plugins/typescript-react-apollo)

For a reference on all GraphQL Code Generator plugins, see [all graphql-code-generator plugins](https://www.graphql-code-generator.com/docs/plugins/index).



`./graphql/server/config.js`

```
import { nextHandler, remote } from "next-graphql"

export const handler = () => {
  return nextHandler({
    schemas: {
      // ... add your schemas here
    },
  })
}
```

For more information on configuring schemas, see [schema configuration](#schema-configuration).

`./pages/api/graphql.ts`

Binds the server to a Next.js API endpoint

```
import { handler } from "../../graphql/server/config"

// Make sure you keep this line
export const config = {
  api: {
    bodyParser: false,
  },
}

export default handler()
``` -->
