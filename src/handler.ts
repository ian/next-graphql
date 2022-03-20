import { NextApiRequest, NextApiResponse } from 'next'
import { GraphQLSchema } from "graphql";

import {
  getGraphQLParameters,
  processRequest,
  sendResult,
  renderGraphiQL,
} from "graphql-helix";
import {
  envelop,
  useImmediateIntrospection,
  useLogger,
  useSchema,
  useTiming,
} from "@envelop/core";
import { useResponseCache } from '@envelop/response-cache';
import { useGenericAuth, GenericAuthPluginOptions } from '@envelop/generic-auth';

interface Options {
  isLogger?: boolean
  isTiming?: boolean
  isImmediateIntrospection?: boolean
  isResponseCache?: boolean
  isAuth?: GenericAuthPluginOptions 

  endpoint?: string
}

export default function createGraphQLHandler(schema: GraphQLSchema, { 
  isLogger, isImmediateIntrospection, isTiming, isResponseCache,
  isAuth,
  endpoint = '/api/graphql'
}: Options = {}) {

  const plugins = [
    useSchema(schema),
    ...(isLogger ? [useLogger()] : []),
    ...(isTiming ? [useTiming()] : []),
    ...(isImmediateIntrospection ? [useImmediateIntrospection()] : []),
    ...(isResponseCache ? [useResponseCache()] : []),
    ...(isAuth ? [useGenericAuth(isAuth)] : []),
  ];

  const getEnveloped = envelop({ plugins });

  const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "GET") {
      res.writeHead(200, {
        "content-type": "text/html",
      });
      res.end(renderGraphiQL({ endpoint }));
    } else {

      const enveloped = getEnveloped({ req });

      const { body, headers, method = 'GET', query } = req;
      const request = { body, headers, method, query };
      
      const params = getGraphQLParameters(request);
      const result = await processRequest({
        request,
        ...enveloped,
        ...params,
      });

      sendResult(result, res);
    }
  };

  return handler;
};


// import { renderPlaygroundPage } from "graphql-playground-html"
// import type { NextApiRequest, NextApiResponse } from "next"
// import { Config } from "./types"
// import { buildServer } from "./server"

// function handler(config: Config = {}) {
//   return async function handler(req: NextApiRequest, res: NextApiResponse) {
//     if (config.cors) {
//       res.setHeader("Access-Control-Allow-Origin", "*")
//       res.setHeader(
//         "Access-Control-Allow-Headers",
//         "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//       )

//       if (req.method == "OPTIONS") {
//         res.setHeader(
//           "Access-Control-Allow-Methods",
//           "PUT, POST, PATCH, DELETE, GET"
//         )
//         return res.status(200).json({})
//       }
//     }

//     if (req.method === "POST") {
//       const server = await buildServer(config)
//       const handler = server.createHandler({
//         path: "/api/graphql",
//       })

//       await handler(req, res)
//     } else {
//       res.setHeader("Content-Type", "text/html")
//       res.send(
//         renderPlaygroundPage({
//           endpoint: `/api/graphql`,
//         })
//       )
//       res.status(200)
//     }
//   }
// }

// export default handler
