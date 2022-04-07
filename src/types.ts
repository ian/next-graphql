import { GraphQLSchema } from "graphql"
import { Rule } from "graphql-shield/dist/rules"
import { IncomingHttpHeaders, OutgoingHttpHeaders } from "http"
import { NextApiRequest } from "next"

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

export type ServerConfig = {
  plugins?: any[],
  session?: any
} & SchemaConfig

export type SchemaConfig = {
  schema?: GraphQLSchema
  middleware?: Middleware[]
  guards?: Guards
}

export type Config = {
  cors?: boolean
}

export type ExecuteOpts = {
  document: string
  variables: object
  operationName: string
  headers?: IncomingHttpHeaders | OutgoingHttpHeaders
}

export type Server = {
  schema: GraphQLSchema
  executeOperation: (req: NextApiRequest) => Promise<any>
  execute: (ExecuteOpts) => Promise<any>
}
