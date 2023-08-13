import { Client, cacheExchange, fetchExchange } from 'urql';
import { GRAPHQL_API_ENDPOINT } from "./Contents";

export const createGraphQLObject = () => {
  // create client instance for GraphQL
  const client = new Client({
    url: GRAPHQL_API_ENDPOINT,
    exchanges: [cacheExchange, fetchExchange],
  });

  return client;
}