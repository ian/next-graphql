import { getSession } from "next-auth/client"

export const authMiddleware = async (resolve, parent, args, context, info) => {
  const session = await getSession()
  // console.log("authMiddleware", { session })
  return resolve(parent, args, { ...context, session }, info)
}
