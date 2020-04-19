const { graphql } = require("graphql")
const { makeExecutableSchema } = require("graphql-tools")

function createHandler(props) {
  const { log, typeDefs, resolvers, directives, operationName } = props

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
    directiveResolvers: directives,
  })

  return async (req, res) => {
    const { query, variables } = req.body

    try {
      if (log) {
        console.log()
        console.log("GRAPHQL")
        console.log(query)
        if (variables) console.log("variables: ", JSON.stringify(variables))
      }

      const context = props.context && (await props.context(req))
      const body = await graphql(
        schema,
        query,
        {},
        context,
        variables,
        operationName
      )

      res.status(200).send(JSON.stringify(body))
    } catch (err) {
      console.log(err)

      res.status(401).send(
        JSON.stringify({
          errors: [err.message],
        })
      )
    }
  }
}

module.exports = {
  createHandler,
}
