import testServer from "../.jest/server"
import { remote, delegate } from "../src"

describe("extensions", () => {
  it("should allow extensions to override a subschema", async () => {
    const overridder = (schemas) => ({
      typeDefs: ``,
      resolvers: {
        Query: {
          ship: delegate(schemas.spacex.originalSchema, {
            args: (args) => ({ ...args, id: "ASOG" }),
          }),
        },
      },
    })

    const config = {
      schemas: {
        spacex: remote("https://api.spacex.land/graphql"),
      },
      extensions: [overridder],
    }
    
    const data = await testServer(config)
      .then(({ graphql }) =>
        graphql(`
          query {
            ship(id: "HOLLYWOOD") {
              id
              name
            }
          }
        `)
      )
      .then((res) => res.data)

    // The above overrideer will intercept the request and rewrite
    expect(data.ship?.id).toEqual("ASOG")
    expect(data.ship?.name).toEqual("A Shortfall of Gravitas")
  })
})
