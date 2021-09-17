const { buildServer } = require("../src/server")

async function testServer(config) {
  const server = await buildServer(config)
  const graphql = async (query, variables, http) => server.executeOperation({ query, variables, http })
  return new Promise((resolve) => resolve({ server, graphql }).finally(server.stop))
}

module.exports = testServer