import testServer from "../.jest/server"
import { remote, helpers } from "../src"

describe("#prune", () => {
  it("should allow type pruning", async () => {
    const schema = await testServer({
      schemas: {
        spacex: remote("https://api.spacex.land/graphql", {
          prune: {
            types: helpers.exceptTypes("Ship")
          }
        })
      }
    }).then(({ schema }) => schema)

    const typeMap = Object.keys(schema.getTypeMap())
    expect(typeMap).not.toContain("Ship")
  })

  it("should allow field pruning", async () => {
    const schema = await testServer({
      schemas: {
        spacex: remote("https://api.spacex.land/graphql", {
          prune: {
            fields: helpers.exceptFields({
              "Ship": "name"
            })
          }
        })
      }
    }).then(({ schema }) => schema)

    const typeMap = schema.getTypeMap()
    const fields = typeMap['Ship'].toConfig()['fields']
    expect(fields).not.toContain("name")
  })
})
