import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import passport from "passport";
import session from "express-session";
import ConnectMongoDBSession from "connect-mongodb-session";
import { GraphQLLocalStrategy, buildContext } from "graphql-passport";

import connectDb from "./db/connectDb.js";
import { configurePassport } from "./passport/passport.config.js";

dotenv.config();
configurePassport();

const app = express();
const httpServer = http.createServer(app);

import mergedResolvers from "./resolvers/index.js";
import mergedTypeDefs from "./typeDef/index.js";

const MongoDBStore = ConnectMongoDBSession(session);
const store = new MongoDBStore({
   uri: process.env.MONGO_URI,
   collection: "sessions",
});
store.on("error", (error) => console.error(error));

app.use(
   session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
         maxAge: 1000 * 60 * 60 * 24 * 3,
         httpOnly: true,
      },
      store,
   })
);
app.use(passport.initialize());
app.use(passport.session());

const server = new ApolloServer({
   typeDefs: mergedTypeDefs,
   resolvers: mergedResolvers,
   plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(
   "/graphql",
   cors({
      origin: "*",
      credentials: true,
   }),
   express.json(),
   expressMiddleware(server, {
      context: async ({ req, res }) => buildContext({ req, res }),
   })
);

await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
await connectDb();

console.log(`🚀 Server ready at http://localhost:4000/`);
