import { GraphQLSchema } from "graphql"
import { SubschemaConfig } from "@graphql-tools/delegate"
import { Rule } from "graphql-shield/dist/rules"

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
  guards?: {
    [type: string]: {
      [object: string]: Rule
    }
  }
}

export type Schemas = {
  [name: string]:
    | GraphQLSchema
    | SubschemaConfig
    | Promise<GraphQLSchema | SubschemaConfig>
}

export type CodegenConfig = {
  operations: string
}

export type Config = {
  schemas?: Schemas
  extensions?: ((schemas: Schemas) => Extension)[]
  // codegen?: CodegenConfig
}
