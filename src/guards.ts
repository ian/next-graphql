import { rule, shield } from "graphql-shield"
import { Guards } from "./types"

export function guardsMiddleware(guards: Guards) {
  return shield(guards)
}

export { rule, and, not, or, shield } from "graphql-shield"