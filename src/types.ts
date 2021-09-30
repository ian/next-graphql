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

  // For now we're not going to support extension guards. Maybe in the future we will
  // guards?: Guards
}

export type Schemas = {
  [name: string]: GraphQLSchema | Promise<GraphQLSchema>
}

export type CodegenConfig = {
  operations: string
}

export type Config = {
  cors?: boolean
  session?: any
  schemas?: Schemas
  extensions?: ((schemas: Schemas) => Extension)[]
  middleware?: Middleware[]
  guards?: Guards
  // codegen?: CodegenConfig
}

export type Server = ApolloServer & {
  schema: GraphQLSchema
}
