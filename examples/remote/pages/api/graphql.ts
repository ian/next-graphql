import { nextHandler, remote } from "next-graphql"

export const config = {
  api: {
    bodyParser: false,
  },
}

export default nextHandler({
  schemas: {
    spacex: remote("https://api.spacex.land/graphql")
  },
})