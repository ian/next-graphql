import { createHandler } from "../../../index"

let ITEMS = [{ name: "First" }]

const typeDefs = `
  type Item {
    name: String! 
  }

  type Query {
    getItems: [Item]!
  }

  type Mutation {
    createItem(name: String!): Item!
    generateError(message: String!): String
  }
`

const resolvers = {
  Query: {
    getItems: async () => {
      return ITEMS
    },
  },
  Mutation: {
    createItem: async (obj, { name }) => {
      const item = { name }
      ITEMS.push(item)
      return item
    },
    generateError: async (obj, { message }) => {
      throw new Error(message)
    },
  },
}

export default createHandler({
  cors: true,
  typeDefs,
  resolvers,
  errorLogger: (err, context) => {
    console.log("Error Occurred:")
    console.log("Message", err.message)
    console.log("Query", JSON.stringify(context.gql.query, null, 2))
  },
})
