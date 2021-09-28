import testServer from "../.jest/server"
import { printSchema } from "graphql"
import { remote, helpers } from "../src"

describe("#prune", () => {
  it("should prune by default", async () => {
    const schema = await remote("https://api.spacex.land/graphql", {
      filter: {
        types: helpers.onlyTypes("String"),
      },
    })

    const typeMap = Object.keys(schema.getTypeMap())
    expect(typeMap).not.toContain("Mutation")
  })

  it("should not prune when prune = false", async () => {
    const schema = await remote("https://api.spacex.land/graphql", {
      filter: {
        types: helpers.onlyTypes("String"),
      },
      prune: false,
    })

    const typeMap = Object.keys(schema.getTypeMap())
    expect(typeMap).toContain("Mutation")
  })
})
