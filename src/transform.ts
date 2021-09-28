import { filterSchema, pruneSchema } from "@graphql-tools/utils"

type TypePruner = (typeName: string) => boolean
type FieldPruner = (typeName: string, fieldName: string) => boolean
type ArgPruner = (
  typeName: string,
  fieldName: string,
  argName: string
) => boolean

export type FilterOpts = {
  types?: TypePruner
  fields?: FieldPruner
  args?: ArgPruner
}

class FilterTransform {
  typeFilter: TypePruner = null
  fieldFilter: FieldPruner = null
  argumentFilter: ArgPruner = null

  constructor(opts: FilterOpts) {
    this.typeFilter = opts.types
    this.fieldFilter = opts.fields
    this.argumentFilter = opts.args
  }

  transformSchema(schema) {
    return filterSchema({
      schema,
      typeFilter: this.typeFilter,
      fieldFilter: this.fieldFilter,
      argumentFilter: this.argumentFilter,
      // rootFieldFilter: (operationName, fieldName) => isPublicName(fieldName),
    })
  }
}

export function filterTransformer(opts: FilterOpts) {
  return new FilterTransform(opts)
}

class PruneTransform {
  typeFilter: TypePruner = null
  fieldFilter: FieldPruner = null
  argumentFilter: ArgPruner = null

  constructor() {
  }

  transformSchema(schema) {
    return pruneSchema(schema)
  }
}

export function pruneTransformer() {
  return new PruneTransform()
}
