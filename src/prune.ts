import { wrapSchema } from '@graphql-tools/wrap';
import { filterSchema, pruneSchema } from '@graphql-tools/utils';

type TypePruner = (typeName:string) => boolean

export type PruneOpts = {
  types?: TypePruner
}

export default function prune(schema, pruneOpts: PruneOpts) {
  const { 
    types: typeFilter  
  } = pruneOpts

  class RemovePrivateElementsTransform {
    transformSchema(originalWrappingSchema) {
      const isPublicName = name => !name.startsWith('_');
  
      return pruneSchema(
        filterSchema({
          schema: originalWrappingSchema,
          typeFilter
          // typeFilter: typeName => isPublicName(typeName),
          // rootFieldFilter: (operationName, fieldName) => isPublicName(fieldName),
          // fieldFilter: (typeName, fieldName) => isPublicName(fieldName),
          // argumentFilter: (typeName, fieldName, argName) => isPublicName(argName),
        })
      );
    }
  
    // no need for operational transforms
  }

  return wrapSchema({
    schema,
    transforms: [new RemovePrivateElementsTransform()],
  })
}
