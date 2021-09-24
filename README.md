> NOTE - next-graphql is still in alpha and not suitable for production environments yet.

# Overview

NextGraphQL.js is a zero-config [GraphQL](https://graphql.org) server for [Next.js](https://nextjs.org/), designed specifically to be run in a Next.js and Serverless environment.

# Getting Started

From your main Next.js project path run:

```
npx next-graphql init
```

Then, open http://localhost:3000/api/graphql. 

<!-- We were lovingly inspired by the simplicity of [next-auth](https://github.com/nextauthjs/next-auth) and [next-crud](https://github.com/roldanjr/next-crud) -->

# Features

- Built-in support for [NextAuth](https://github.com/nextauthjs/next-auth)
- Schema merging + stitching
- Remote schemas
- Extensions
- Guards on Endpoints + Properties
- ... and more soon, let us know what features you need!

# Examples

## Nexus

`pages/api/graphql.ts`

```
import { nextHandler } from "next-graphql"
import nexus from "../../api/nexus"

export const config = {
  api: {
    bodyParser: false,
  },
}

export default nextHandler({
  schemas: {
    nexus,
  },
})
```

`graphql/nexus.ts`

```
import { extendType, objectType, makeSchema } from "nexus"

export const Query = extendType({
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

export default makeSchema({
  types: [Query],
})
```

For a more complete examples, see [examples/nexus](./examples/nexus)

## Remote Schemas

### Basic remote schema

For a full working remote example, see see [examples/remote](./examples/remote)

This will add the [SpaceX GraphQL](https://api.spacex.land/graphql) endpoints:

`pages/api/graphql.ts`

```
import { nextHandler, remote } from "next-graphql"

export default nextHandler({
  schemas: {
    spacex: remote("https://api.spacex.land/graphql"),
  },
})
```

### Custom headers/authentication

Suppose you want to add an authorized endpoint, i.e. [GraphCMS](https://graphcms.com):

`pages/api/graphql.ts`

```
import { nextHandler, remote } from "next-graphql"

export default nextHandler({
  schemas: {
    graphcms: remote(process.env.GRAPHCMS_URL, {
      headers: {
        Authorization: "Bearer " + process.env.GRAPHCMS_TOKEN,
      },
    }),
  },
})
```

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