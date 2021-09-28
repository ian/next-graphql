import { wrapSchema } from '@graphql-tools/wrap';
import { filterSchema, pruneSchema } from '@graphql-tools/utils';

type TypePruner = (typeName:string) => boolean
type FieldPruner = (typeName:string, fieldName: string) => boolean
type ArgPruner = (typeName:string, fieldName: string, argName: string) => boolean

export type FilterOpts = {
  types?: TypePruner
  fields?: FieldPruner
  args?: ArgPruner
}

// function prune(schema, pruneOpts: PruneOpts) {
//   return wrapSchema({
//     schema,
//     transforms: [new RemovePrivateElementsTransform()],
//   })
// }

class RemovePrivateElementsTransform {
  typeFilter: TypePruner = null;
  fieldFilter: FieldPruner = null
  argumentFilter: ArgPruner = null

  constructor(opts: FilterOpts) {
    this.typeFilter = opts.types
    this.fieldFilter = opts.fields
    this.argumentFilter = opts.args
  }

  transformSchema(originalWrappingSchema) {
    return pruneSchema(
      filterSchema({
        schema: originalWrappingSchema,
        typeFilter: this.typeFilter,
        fieldFilter: this.fieldFilter,
        argumentFilter: this.argumentFilter
        // rootFieldFilter: (operationName, fieldName) => isPublicName(fieldName),
      })
    );
  }
}

export function pruneTransformer(opts: FilterOpts) {
  return new RemovePrivateElementsTransform(opts)
}
