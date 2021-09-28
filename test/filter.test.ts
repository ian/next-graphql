import { printSchema } from "graphql"
import testServer from "../.jest/server"
import { remote, helpers } from "../src"

describe("#exceptTypes", () => {
  it("include all types except the filtered", async () => {
    const schema = await testServer({
      schemas: {
        spacex: remote("https://api.spacex.land/graphql", {
          filter: {
            types: helpers.exceptTypes("Ship"),
          },
        }),
      },
    }).then(({ schema }) => schema)

    const typeMap = Object.keys(schema.getTypeMap())
    expect(typeMap).not.toContain("Ship")
  })

  it("should work with regex", async () => {
    const schema = await testServer({
      schemas: {
        spacex: remote("https://api.spacex.land/graphql", {
          filter: {
            types: helpers.exceptTypes("Ship.*"),
          },
        }),
      },
    }).then(({ schema }) => schema)

    const typeMap = Object.keys(schema.getTypeMap())
    expect(typeMap).not.toContain("Ship")
    expect(typeMap).not.toContain("ShipMission")
  })
})

describe("exceptFields", () => {
  it("include all fields except filtered", async () => {
    const spacex = await remote("https://api.spacex.land/graphql", {
      filter: {
        fields: helpers.exceptFields({
          Ship: "name",
        }),
      },
    })

    const schema = await testServer({
      schemas: {
        spacex,
      },
    }).then(({ schema }) => schema)

    const fieldsFor = (s) => s.getTypeMap()["Ship"].toConfig()["fields"]

    expect(Object.keys(fieldsFor(schema))).not.toContain("name")
    expect(Object.keys(fieldsFor(spacex.originalSchema))).toContain("name")
  })

  it("should work with regex", async () => {
    const spacex = await remote("https://api.spacex.land/graphql", {
      filter: {
        fields: helpers.exceptFields({
          Ship: "i.*",
        }),
      },
    })

    const schema = await testServer({
      schemas: {
        spacex,
      },
    }).then(({ schema }) => schema)

    const fieldsFor = (s) => s.getTypeMap()["Ship"].toConfig()["fields"]

    expect(Object.keys(fieldsFor(schema))).not.toContain("image")
    expect(Object.keys(fieldsFor(spacex.originalSchema))).toContain("image")
  })
})

describe("#onlyTypes", () => {
  it("should only have the type", async () => {
    const schema = await testServer({
      schemas: {
        spacex: remote("https://api.spacex.land/graphql", {
          filter: {
            types: helpers.onlyTypes("String", "Ship"),
          },
        }),
      },
    }).then(({ schema }) => schema)

    const typeMap = Object.keys(schema.getTypeMap())
    expect(typeMap).toContain("Ship")
    expect(typeMap).not.toContain("ShipMission")
  })

  it("should work with regex", async () => {
    const spacex = await remote("https://api.spacex.land/graphql", {
      filter: {
        types: helpers.onlyTypes("String", "Ship.*"),
      },
    })

    const schema = await testServer({
      schemas: {
        spacex,
      },
    }).then(({ schema }) => schema)

    const typeMap = Object.keys(schema.getTypeMap())
    expect(typeMap).toContain("Ship")
    expect(typeMap).toContain("ShipMission")
  })
})

describe("onlyFields", () => {
  it.only("include all fields except filtered", async () => {
    const spacex = await remote("https://api.spacex.land/graphql", {
      filter: {
        fields: helpers.onlyFields({
          Ship: "name",
        }),
      },
    })

    console.log(printSchema(spacex))

    const schema = await testServer({
      schemas: {
        spacex,
      },
    }).then(({ schema }) => schema)

    const fieldsFor = (s) => s.getTypeMap()["Ship"].toConfig()["fields"]

    expect(Object.keys(fieldsFor(schema))).not.toContain("name")
    // smoke test
    expect(Object.keys(fieldsFor(spacex.originalSchema))).toContain("name")
  })

  it("should work with regex", async () => {
    const spacex = await remote("https://api.spacex.land/graphql", {
      filter: {
        fields: helpers.onlyFields({
          Ship: "i.*",
        }),
      },
    })

    const schema = await testServer({
      schemas: {
        spacex,
      },
    }).then(({ schema }) => schema)

    const fieldsFor = (s) => s.getTypeMap()["Ship"].toConfig()["fields"]

    expect(Object.keys(fieldsFor(schema))).not.toContain("name")
    expect(Object.keys(fieldsFor(schema))).toContain("image")
    // smoke test
    expect(Object.keys(fieldsFor(spacex.originalSchema))).toContain("image")
  })
})