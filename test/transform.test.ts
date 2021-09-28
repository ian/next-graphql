import { makeExecutableSchema } from "@graphql-tools/schema"
import { wrapSchema } from "@graphql-tools/wrap"
import { printSchema } from "graphql"
import { pruneTransformer } from "../src/transform"

describe("prune", () => {
  it("should prune out unused elements", () => {
    const schema = makeExecutableSchema({
      typeDefs: `
      type Query {
        ships(limit: Int, offset: Int, order: String, sort: String): [Ship]
        ship(id: ID!): Ship
      }
      
      type Ship {
        name: String
      }
      
      type Mutation
      type Subscription`,
    })
  
    const wrapped = wrapSchema({
      schema,
      transforms: [pruneTransformer()],
    })
  
    const printed = printSchema(wrapped)
    expect(printed).toEqual(`type Query {
  ships(limit: Int, offset: Int, order: String, sort: String): [Ship]
  ship(id: ID!): Ship
}

type Ship {
  name: String
}
`)
  })
})
