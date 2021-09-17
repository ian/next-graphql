import { delegateToSchema } from "@graphql-tools/delegate"

type Opts = {
  args?: (object) => object
  context?: (object) => object
}

export default function delegate(schema, opts: Opts = {}) {
  return async (obj, args, context, info) => {
    const { fieldName } = info
    const { operation } = info.operation

    const params = {
      schema,
      operation,
      fieldName,
      args: opts.args ? opts.args(args) : args,
      context: opts.context ? opts.context(context) : context,
      info,
    }

    return delegateToSchema(params)
  }
}
