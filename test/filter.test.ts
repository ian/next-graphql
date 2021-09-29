import { remote, helpers } from "../src"

describe("types", () => {
  const getTypes = (schema) => Object.keys(schema.getTypeMap()).sort()

  it("smoke test", async () => {
    const schema = await remote("https://api.spacex.land/graphql")
    const types = getTypes(schema)
    expect(types).toContain("Ship")
    expect(types).toContain("Launch")
  })

  it("#onlyTypes", async () => {
    const schema = await remote("https://api.spacex.land/graphql", {
      filter: {
        types: helpers.onlyTypes("String", "Ship"),
      },
    })

    const types = getTypes(schema)
    expect(types).toContain("Ship")
    expect(types).not.toContain("Launch")
  })

  it("#onlyTypes regex", async () => {
    const schema = await remote("https://api.spacex.land/graphql", {
      filter: {
        types: helpers.onlyTypes("String", "Ship.*"),
      },
    })

    const types = getTypes(schema)
    expect(types).toContain("Ship")
    expect(types).not.toContain("Launch")
  })

  it("#exceptTypes", async () => {
    const schema = await remote("https://api.spacex.land/graphql", {
      filter: {
        types: helpers.exceptTypes("Ship"),
      },
    })

    const types = getTypes(schema)
    expect(types).not.toContain("Ship")
    expect(types).toContain("ShipsFind")
    expect(types).toContain("Launch")
  })

  it("#exceptTypes regex", async () => {
    const schema = await remote("https://api.spacex.land/graphql", {
      filter: {
        types: helpers.exceptTypes("Ship.*"),
      },
    })

    const types = getTypes(schema)
    expect(types).not.toContain("Ship")
    expect(types).not.toContain("ShipsFind")
    expect(types).toContain("Launch")
  })
})

describe("fields", () => {
  const getFields = (schema) => schema.getTypeMap()["Ship"].toConfig()["fields"]
  it("smoke test", async () => {
    const schema = await remote("https://api.spacex.land/graphql")
    const fields = getFields(schema)
    expect(fields.id).toBeDefined()
    expect(fields.name).toBeDefined()
  })

  it("#onlyFields", async () => {
    const schema = await remote("https://api.spacex.land/graphql", {
      filter: {
        fields: helpers.onlyFields({
          Ship: "name",
        }),
      },
    })

    const fields = getFields(schema)
    expect(fields.name).toBeDefined()
    expect(fields.id).toBeUndefined()
  })

  it("#onlyFields regex", async () => {
    const schema = await remote("https://api.spacex.land/graphql", {
      filter: {
        fields: helpers.onlyFields({
          Ship: "c.*",
        }),
      },
    })

    const fields = getFields(schema)
    expect(fields.class).toBeDefined()
    expect(fields.course_deg).toBeDefined()
    expect(fields.id).toBeUndefined()
  })

  it("#exceptFields", async () => {
    const schema = await remote("https://api.spacex.land/graphql", {
      filter: {
        fields: helpers.exceptFields({
          Ship: "name",
        }),
      },
    })

    const fields = getFields(schema)
    expect(fields.name).toBeUndefined()
    expect(fields.id).toBeDefined()
  })

  it("#exceptFields regex", async () => {
    const schema = await remote("https://api.spacex.land/graphql", {
      filter: {
        fields: helpers.exceptFields({
          Ship: "n.*",
        }),
      },
    })

    const fields = getFields(schema)
    expect(fields.name).toBeUndefined()
    expect(fields.id).toBeDefined()
  })
})

describe("root", () => {
  it("smoke test", async () => {
    const schema = await remote("https://api.spacex.land/graphql")
    const fields = schema.getTypeMap()["Query"].toConfig()["fields"]
    expect(fields.ship).not.toBeUndefined()
    expect(fields.ships).not.toBeUndefined()
  })

  it("#onlyFields", async () => {
    const schema = await remote("https://api.spacex.land/graphql", {
      filter: {
        root: helpers.onlyFields({
          Query: "ship",
        }),
      },
    })

    const fields = schema.getTypeMap()["Query"].toConfig()["fields"]
    expect(fields.ship).toBeDefined()
    expect(fields.ships).toBeUndefined()
  })

  it("#onlyFields regex", async () => {
    const schema = await remote("https://api.spacex.land/graphql", {
      filter: {
        root: helpers.onlyFields({
          Query: "s.*",
        }),
      },
    })

    const fields = schema.getTypeMap()["Query"].toConfig()["fields"]
    expect(fields.ship).toBeDefined()
    expect(fields.ships).toBeDefined()
  })

  it("#exceptFields", async () => {
    const schema = await remote("https://api.spacex.land/graphql", {
      filter: {
        root: helpers.exceptFields({
          Query: "ship",
        }),
      },
    })

    const fields = schema.getTypeMap()["Query"].toConfig()["fields"]
    expect(fields.ship).toBeUndefined()
    expect(fields.ships).not.toBeUndefined()
  })

  it("#exceptFields", async () => {
    const schema = await remote("https://api.spacex.land/graphql", {
      filter: {
        root: helpers.exceptFields({
          Query: "s.*",
        }),
      },
    })

    const fields = schema.getTypeMap()["Query"].toConfig()["fields"]
    expect(fields.ship).toBeUndefined()
    expect(fields.ships).toBeUndefined()
  })
})
