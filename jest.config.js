const pack = require("./package")

module.exports = {
  verbose: true,
  verbose: true,
  rootDir: "./",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  displayName: pack.name,
  name: pack.name,
  // setupFiles: [__dirname + "/.jest/env.js"],
  // setupFilesAfterEnv: [__dirname + "/.jest/db.js"],
  testMatch: ["**/*.test.ts"],
}
