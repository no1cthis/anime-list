import { ApolloClient, InMemoryCache } from "@apollo/client";

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "https://graphql.anilist.co/",
});


// import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
// import getConfig from 'next/config';

// const { publicRuntimeConfig } = getConfig();

// function createApolloClient() {
//   return new ApolloClient({
//     ssrMode: typeof window === 'undefined',
//     link: new HttpLink({
//       uri: "https://graphql.anilist.co/",
//     }),
//     cache: new InMemoryCache(),
//   });
// }

// export default createApolloClient;