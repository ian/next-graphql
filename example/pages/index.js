import { useEffect } from "react"
import Head from "next/head"

export default function Home() {
  useEffect(() => {
    const graphQLFetcher = (graphQLParams) =>
      fetch("/api/graphql", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(graphQLParams),
      })
        .then((response) => response.json())
        .catch(() => response.text())

    ReactDOM.render(
      React.createElement(GraphiQL, { fetcher: graphQLFetcher }),
      document.getElementById("graphiql")
    )
  }, [])

  return (
    <div className="container">
      <Head>
        <title>GraphiQL</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://unpkg.com/graphiql/graphiql.min.css"
          rel="stylesheet"
        />

        <script
          crossorigin
          src="https://unpkg.com/react/umd/react.production.min.js"
        ></script>
        <script
          crossorigin
          src="https://unpkg.com/react-dom/umd/react-dom.production.min.js"
        ></script>
        <script
          crossorigin
          src="https://unpkg.com/graphiql/graphiql.min.js"
        ></script>
      </Head>

      <div id="graphiql" style={{ height: "100vh" }}></div>
    </div>
  )
}
