import { wrapSchema } from '@graphql-tools/wrap';
import { filterSchema, pruneSchema } from '@graphql-tools/utils';

type TypePruner = (typeName:string) => boolean
type FieldPruner = (typeName:string, fieldName: string) => boolean
type ArgPruner = (typeName:string, fieldName: string, argName: string) => boolean

export type PruneOpts = {
  types?: TypePruner
  fields?: FieldPruner
  args?: ArgPruner
}

function prune(schema, pruneOpts: PruneOpts) {
  const { 
    types: typeFilter,
    fields: fieldFilter,
    args: argumentFilter,
  } = pruneOpts

  class RemovePrivateElementsTransform {
    transformSchema(originalWrappingSchema) {
      return pruneSchema(
        filterSchema({
          schema: originalWrappingSchema,
          typeFilter,
          fieldFilter,
          argumentFilter
          // rootFieldFilter: (operationName, fieldName) => isPublicName(fieldName),
        })
      );
    }
  }

  return wrapSchema({
    schema,
    transforms: [new RemovePrivateElementsTransform()],
  })
}

prune.fieldsExcept = function(pairs) {
  return (type, field) => {
    if (pairs[type]) {
      const fields = Array(pairs[type])
      if (fields.includes(field)) return false
    }
    return true
  }
}

export default prune