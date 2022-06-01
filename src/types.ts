import { GraphQLSchema } from "graphql"
import { Rule } from "graphql-shield/dist/rules"
import { IncomingHttpHeaders, OutgoingHttpHeaders } from "http"

export type Guards = {
  [type: string]: {
    [object: string]: Rule
  }
}

export type Middleware = (
  resolve: any,
  parent: any,
  args: any,
  context: any,
  info: any
) => Promise<any>

export type Extensions = {
  middleware?: Middleware[]
  guards?: Guards
}

export type ServerConfig = {
  schema: GraphQLSchema
  plugins?: any[]
  session?: (context: any) => any
} & Extensions

export type BuildSchemaConfig = {
  typeDefs: string
  resolvers: any
}

export type ExtendSchemaConfig = {
  schema?: GraphQLSchema
} & Extensions

export type Config = {
  cors?: boolean
} & BuildSchemaConfig

export type ExecuteOpts = {
  document: string
  variables: object
  operationName: string
  headers?: IncomingHttpHeaders | OutgoingHttpHeaders
}

// export type Server = {
//   schema: GraphQLSchema
//   executeOperation: (req: NextApiRequest) => Promise<any>
//   execute: (ExecuteOpts) => Promise<any>
// }
