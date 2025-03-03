import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import mergedResolvers from "./resolvers";
import mergedTypeDefs from "./typeDef";

const server = new ApolloServer({
   typeDefs: mergedTypeDefs,
   resolvers: mergedResolvers,
});

const { url } = await startStandaloneServer(server);

console.log(`🚀 Server ready at ${url}`);
