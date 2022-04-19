import testServer from "../.jest/server"
import { Guards } from "../src"
import { makeExecutableSchema } from "@graphql-tools/schema";
const { or, rule } = Guards

describe("#guards", () => {
  it("should allow guarded endpoints", async () => {
    const { graphql } = await serverWithGuards({
      Query: {
        hello: failRule,
      },
    })

    const { errors, data } = await graphql(`
      query {
        hello
      }
    `)

    expect(data).toEqual(null)
    expect(errors[0].message).toEqual("FAIL")
  })

  describe("modifiers", () => {
    it("should allow guarded endpoints", async () => {
      const { graphql } = await serverWithGuards({
        Query: {
          hello: or(failRule, succeedRule),
        },
      })

      const { errors, data } = await graphql(`
        query {
          hello
        }
      `)

      expect(data).toEqual({
        hello: "World",
      })
      expect(errors).toBeUndefined()
    })
  })
})

async function serverWithGuards(guards) {
  const schema = makeExecutableSchema({
    typeDefs: /* GraphQL */ `
      type Query {
        hello: String!
      }
    `,
    resolvers: {
      Query: {
        hello: () => 'World',
      },
    },
  });

  return testServer({
    schema,
    guards,
  })
}

const failRule = rule()(async () => {
  return new Error("FAIL")
})

const succeedRule = rule()(async () => {
  return true
})
