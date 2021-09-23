import { nextHandler } from "next-graphql"
import nexus from "../../graphql/nexus"

export const config = {
  api: {
    bodyParser: false,
  },
}

const graphqlConfig = {
  schemas: {
    nexus,
  },
}

export default nextHandler(graphqlConfig)