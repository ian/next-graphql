import { createHandler } from "../../../index"

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
      return ITEMS
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
  cors: true,
  typeDefs,
  resolvers,
})