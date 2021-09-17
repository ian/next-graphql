const { printSchema } = require("graphql")
const { buildServer } = require("../src/server")

async function testServer(config) {
  const server = await buildServer(config)
  const { schema } = server
  const typeDefs = printSchema(schema)
  const graphql = async (query, variables, http) => server.executeOperation({ query, variables, http })

  return new Promise((resolve) => resolve({ server, schema, typeDefs, graphql }).finally(server.stop))
}

module.exports = testServer