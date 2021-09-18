import { GraphQLSchema } from "graphql"
import { ApolloServer } from "apollo-server-micro"
import { Rule } from "graphql-shield/dist/rules"

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

export type Extension = {
  typeDefs?: string
  resolvers?: {
    [key: string]: any
  }
  middleware?: Middleware | Middleware[]
  guards?: Guards
}

export type Schemas = {
  [name: string]:
    | GraphQLSchema
    | Promise<GraphQLSchema>
}

export type CodegenConfig = {
  operations: string
}

export type Config = {
  schemas?: Schemas
  extensions?: ((schemas: Schemas) => Extension)[],
  middleware?: Middleware | Middleware[]
  guards?: Guards
  // codegen?: CodegenConfig
}

export type Server = ApolloServer & {
  schema: GraphQLSchema
}