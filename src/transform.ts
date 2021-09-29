import { stitchSchemas } from "@graphql-tools/stitch"
import { filterSchema, pruneSchema } from "@graphql-tools/utils"

type TypePruner = (typeName: string) => boolean
type FieldPruner = (typeName: string, fieldName: string) => boolean
type ArgPruner = (
  typeName: string,
  fieldName: string,
  argName: string
) => boolean
type RootPruner = (operationName: string, fieldName: string) => boolean

export type FilterOpts = {
  types?: TypePruner
  fields?: FieldPruner
  args?: ArgPruner
  root?: RootPruner
}

export function filter(schema, opts: FilterOpts) {
  const {
    types: typeFilter,
    fields: fieldFilter,
    args: argumentFilter,
    root: rootFieldFilter,
  } = opts

  return filterSchema({
    schema,
    typeFilter,
    fieldFilter,
    argumentFilter,
    rootFieldFilter,
  })
}

export function prune(schema) {
  return pruneSchema(schema)
}

export default function stitch(subschemas, extensions = {}) {
  return stitchSchemas({
    subschemas,
    ...extensions,
  })
}
