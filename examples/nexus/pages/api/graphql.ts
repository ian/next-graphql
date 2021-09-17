import { nextHandler } from "next-graphql"
import nexus from "../../api/nexus"

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