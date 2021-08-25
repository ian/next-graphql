import { stitchSchemas } from "@graphql-tools/stitch"

export default function stitch(subschemas, extensions = {}) {
  return stitchSchemas({
    subschemas,
    ...extensions,
  })
}
