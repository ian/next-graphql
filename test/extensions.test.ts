import testServer from "../.jest/server"
import { remote } from "../src"

describe("extensions", () => {
  it("should allow extensions to override a subschema", async () => {
    const overridder = () => ({
      typeDefs: ``,
      resolvers: {
        Query: {
          ship: () => {
            return {
              id: "HOLLYWOOD",
              name: "OVERRIDDEN_NAME"
            }
          }
        }
      }
    })
    
    const data = await testServer({
      schemas: {
        spacex: remote("https://api.spacex.land/graphql"),
      },
      extensions: [overridder]
    }).then(({graphql}) => 
      graphql(`
      query {
        ship(id: "HOLLYWOOD") {
          id
          name
        }
      }
      `)
    ).then(res => res.data)

    expect(data.ship?.name).toEqual("OVERRIDDEN_NAME")
  })

  it("should deep merge the extensions", async () => {
    const overridder = () => ({
      typeDefs: ``,
      resolvers: {
        Query: {
          ship: () => {
            return {
              id: "HOLLYWOOD",
              name: "OVERRIDDEN_NAME"
            }
          }
        }
      }
    })

    const dupeQuery = () => ({
      typeDefs: ``,
      resolvers: {
        // this previously caused issues
        Query: {
        }
      }
    })
    
    const data = await testServer({
      schemas: {
        spacex: remote("https://api.spacex.land/graphql"),
      },
      extensions: [overridder, dupeQuery]
    }).then(({graphql}) => 
      graphql(`
      query {
        ship(id: "HOLLYWOOD") {
          id
          name
        }
      }
      `)
    ).then(res => res.data)

    expect(data.ship?.name).toEqual("OVERRIDDEN_NAME")
  })
})
