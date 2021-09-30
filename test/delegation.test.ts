import testServer from "../.jest/server"
import { remote, delegate } from "../src"

describe("extensions", () => {
  it("should allow extensions to override a subschema", async () => {
    const data = await server()

    // The above overrideer will intercept the request and rewrite
    expect(data.ship?.id).toEqual("ASOG")
    expect(data.ship?.name).toEqual("A Shortfall of Gravitas")
  })
})

describe("delegation", () => {
  it("#resolve", async () => {
    const resolve = jest.fn(async (json) => {
      // let's rewrite the request
      return {
        id: "OverrideID",
        name: "OverrideName",
      }
    })

    const data = await server({
      resolve,
    })

    expect(resolve).toHaveBeenCalledTimes(1)

    expect(data.ship?.id).toEqual("OverrideID")
    expect(data.ship?.name).toEqual("OverrideName")

    expect(data.ship?.id).not.toEqual("ASOG")
    expect(data.ship?.name).not.toEqual("A Shortfall of Gravitas")
  })
})

const server = async (args = {}) => {
  const overridder = (schemas) => ({
    typeDefs: ``,
    resolvers: {
      Query: {
        ship: delegate(schemas.spacex.originalSchema, {
          args: (args) => ({ ...args, id: "ASOG" }),
          ...args,
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

  const { graphql } = await testServer(config)
  return graphql(`
    query {
      ship(id: "HOLLYWOOD") {
        id
        name
      }
    }
  `).then((res) => res.data)
}
