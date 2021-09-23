// This is not working

// import fs from "fs"
// import { exec } from "child_process"
// import { printSchema } from "graphql"

// export async function generateClient(schema, opts) {
//   const srcDir = process.cwd() + "/graphql"
//   const genDir = process.cwd() + "/graphql/.gen"

//   await fs.mkdirSync(genDir, { recursive: true })
//   await fs.writeFileSync(genDir + "/schema.graphql", printSchema(schema))
//   await fs.copyFileSync(
//     srcDir + "/operations.graphql",
//     genDir + "/operations.graphql"
//   )
//   await fs.writeFileSync(genDir + "/schema.graphql", printSchema(schema))

//   await fs.writeFileSync(
//     genDir + "/codegen.yml",
//     `
// generates:
//   "${genDir}/urql.tsx":
//     schema: ${genDir}/schema.graphql
//     documents: ${genDir}/operations.graphql
//     config:
//       - withHooks: true
//       - withComponent: true
//     plugins:
//       - typescript
//       - typescript-operations
//       - typescript-urql
//       `
//   )

//   const cwd = process.cwd() + "/node_modules/next-graphql"
//   const cmd =
//     "./node_modules/.bin/graphql-code-generator -c " + genDir + "/codegen.yml"

//   await new Promise((resolve, reject) => {
//     exec(
//       cmd,
//       {
//         cwd
//       },
//       (error, stdout, stderr) => {
//         if (error) {
//           console.log(`error: ${error.message}`)
//           reject(error)
//         }
//         if (stderr) {
//           console.log(`stderr: ${stderr}`)
//           reject(stderr)
//         }
//         console.log(`stdout: ${stdout}`)
//         resolve(stdout)
//       }
//     )
//   })
// }
