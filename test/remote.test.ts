import testServer from "../.jest/server"
import { remote } from "../src"

describe("#remote", () => {
  it("should allow access to the original schema", async () => {
    const remoteSchema = remote("https://api.spacex.land/graphql")
    expect((await remoteSchema).originalSchema.constructor.name).toEqual(
      "GraphQLSchema"
    )
  })
  it("should provide access to the remote schema", async () => {
    const data = await testServer({
      remote: {
        spacex: remote("https://api.spacex.land/graphql"),
      },
    })
      .then(({ graphql }) =>
        graphql(`
          query {
            ships(limit: 1) {
              id
            }
          }
        `)
      )
      .then((res) => res.data)

    expect(data.ships.length).toEqual(1)
  })
})
