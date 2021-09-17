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
})
