import {
  delegateToSchema,
  SubschemaConfig as Config,
} from "@graphql-tools/delegate"

export default function delegate(schema) {
  return (obj, args, context, info) => {
    const { fieldName } = info
    const { operation } = info.operation

    return delegateToSchema({
      schema,
      operation,
      fieldName,
      args,
      context,
      info,
    })
  }
}
