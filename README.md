# next-graphql

Drop dead simple GraphQL implementation for Next.js.  Works with vanilla Next.js and Zeit Serverless Functions (see https://zeit.co/docs/v2/serverless-functions/introduction for more details).

# Installation

`yarn add next-graphql`

or 

`npm i -s next-graphql`

# Example

```
# pages/api/graphql.js 

import { createHandler } from "next-graphql"

let ITEMS = [
  { name: "First" }
]

const typeDefs = `
  type Item {
    name: String! 
  }

  type Query {
    getItems: [Item]!
  }

  type Mutation {
    createItem(name:String!): Item!
  }
`

const resolvers = {
  Query: {
    getItems: async () => {
      return db
    },
  },
  Mutation: {
    createItem: async (obj, { name }) => {
      const item = { name }
      ITEMS.push(item)
      return item
    }
  }
}

export default createHandler({
  typeDefs,
  resolvers,
})

```

## `createHandler`

Options

| Param         | Type          | |
| ------------- |:-------------:| -----:|
| `log`           | boolean     | Log all GQL queries, default: false |
| `typeDefs`      | string      | |
| `resolvers`     | object      | |
| `directives`    | object      | |
| `context`       | function    | `async (req) => ...` |

## JWT Auth example With directives and context

```
# pages/api/graphql.js
# Assumes that a `Authorization: $TOKEN` header is sent from the client.

import jwt from "jsonwebtoken"
import { createHandler } from "~/next-graphql"

const { SECRET } = process.env
if (!secret) throw new Error("Make sure to set SECRET in .env)

const typeDefs = `
  type Auth {
    token: String!
    user: User!
  }

  type User {
    name: String! 
  }

  type Query {
    me: User! @authenticate
  }

  type Mutation {
    register(name: String!): Auth!
  }
`

const resolvers = {
  Query: {
    me: async (obj, params, context) => {
      return context.authUser
    }
  },
  Mutation: {
    register: async (obj) => {
      const token = jwt.sign({
        data: user.id
      }, SECRET, { expiresIn: '1h' });
    }
  }
}

const directives = {
  async authenticate(next, src, args, context) {
    if (!context.authUser) throw new Error("Must be authenticated")
    return next()
  },
}

const loadAuth = async (req) => {
  const authorization = req.headers.Authorization
  if (!authorization) return null

  const decoded = jwt.decode(authorization)
  const userId = decoded.payload

  return User.find(userId)
}

export default createHandler({
  typeDefs,
  resolvers,
  directives,
  context: async (req) => ({ authUser: await loadAuth(req) }),
})
```
