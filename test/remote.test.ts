import testServer from "../.jest/server"
import { remote } from "../src"

describe("#remote", () => {
  it("should provide access to the remote schema", async () => {
    const data = await testServer({
      schemas: {
        spacex: remote("https://api.spacex.land/graphql")
      }
    }).then(({graphql}) => 
      graphql(`
      query {
        ships(limit: 1) {
          id
        }
      }
      `)
    ).then(res => res.data)

    expect(data.ships.length).toEqual(1)
  })

  it("should allow pruning", async () => {
    const schema = await testServer({
      schemas: {
        spacex: remote("https://api.spacex.land/graphql", {
          prune: {
            types: (type) => type !== "Ship"
          }
        })
      }
    }).then(({ schema }) => schema)

    const typeMap = Object.keys(schema.getTypeMap())
    expect(typeMap).not.toContain("Ship")
  })
})
