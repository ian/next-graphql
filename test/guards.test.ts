import testServer from "../.jest/server"
import { remote } from "../src"
import { or, rule } from "../src/guards"

describe("#guards", () => {
  it("should allow guarded endpoints", async () => {
    const { graphql } = await serverWithGuards({
      Query: {
        ship: failRule
      }
    })

    const { errors, data } = await graphql(`
      query {
        ship(id: "HOLLYWOOD") {
          id
          name
        }
      }
    `)

    expect(data).toEqual({ ship: null })
    expect(errors[0].message).toEqual("FAIL")
  })

  describe("modifiers", () => {
    it("should allow guarded endpoints", async () => {
      const { graphql } = await serverWithGuards({
        Query: {
          ship: or(failRule, succeedRule)
        }
      })
  
      const { errors, data } = await graphql(`
        query {
          ship(id: "HOLLYWOOD") {
            id
            name
          }
        }
      `)
  
      expect(data).toEqual({ ship: {
        id: "HOLLYWOOD",
        name: "Hollywood"
      } })
      expect(errors).toBeUndefined()
    })
  })
})

async function serverWithGuards(guards) {
  return testServer({
    schemas: {
      spacex: remote("https://api.spacex.land/graphql"),
    },
    guards,
  })
}

const failRule = rule()(
  async () => {
    return new Error("FAIL")
  }
)

const succeedRule = rule()(
  async () => {
    return true
  }
)