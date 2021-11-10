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

export type Schema = {
  typeDefs?: string
  resolvers?: {
    [key: string]: any
  }
  middleware?: Middleware | Middleware[]

  // For now we're not going to support extension guards. Maybe in the future we will
  // guards?: Guards
}

export type CallableSchema = () => Schema

export type Remote = {
  [name: string]: GraphQLSchema | Promise<GraphQLSchema>
}

export type CodegenConfig = {
  operations: string
}

export type Config = {
  cors?: boolean
  session?: any
  schema?: Schema | CallableSchema | (Schema | CallableSchema)[]
  remote?: Remote
  middleware?: Middleware[]
  guards?: Guards
}

export type Server = ApolloServer & {
  schema: GraphQLSchema
}
