import { nextHandler } from "next-graphql"
import nexus from "../../graphql/nexus"

export const config = {
  api: {
    bodyParser: false,
  },
}

export default nextHandler({
  remote: {
    nexus,
  },
})
