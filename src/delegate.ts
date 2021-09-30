import { delegateToSchema } from "@graphql-tools/delegate"

type Opts = {
  debug?: boolean
  args?: (args: object, context: object) => object
  context?: (object) => object
  operation?: "query" | "mutation" | "subscription"
  fieldName?: string
  resolve?: (
    res: object,
    obj: any,
    args: object,
    context: object,
    info: object
  ) => object
}

export default function delegate(schema, opts: Opts = {}) {
  const handler = async (obj, args, context, info) => {
    const fieldName = opts.fieldName || info.fieldName
    const operation = opts.operation || info.operation.operation

    const params = {
      schema,
      operation,
      fieldName,
      args: opts.args ? opts.args(args, context) : args,
      context: opts.context ? opts.context(context) : context,
      info,
    }

    return delegateToSchema(params)
  }

  if (opts.resolve) {
    return async (obj, args, context, info) => {
      return handler(obj, args, context, info).then((res) =>
        opts.resolve(res, obj, args, context, info)
      )
    }
  }

  return handler
}
