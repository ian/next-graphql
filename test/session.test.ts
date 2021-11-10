import testServer from "../.jest/server"

describe("#session", () => {
  it("should allow guarded endpoints", async () => {
    const session = jest.fn(async () => {
      return "SESSION OBJECT"
    })
    const { graphql } = await server(session)

    const { errors, data } = await graphql(`
      query {
        session
        secondEndpoint
      }
    `)

    expect(session).toHaveBeenCalledTimes(1)
    expect(errors).not.toBeDefined()
    expect(data.session).toEqual("SESSION OBJECT")
  })
})

const server = (session) => {
  return testServer({
    session,
    schema: [
      () => ({
        typeDefs: `
        type Query {
          session: String
          secondEndpoint: String
        }
      `,
        resolvers: {
          Query: {
            session: (obj, args, context) => {
              return context.session
            },
            secondEndpoint: (bj, args, context) => {
              return context.session
            },
          },
        },
      }),
    ],
  })
}
