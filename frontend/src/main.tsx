import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import Background from "./components/Background.tsx";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
   uri: "http://localhost:4000/graphql",
   cache: new InMemoryCache(),
   credentials: "include",
});

createRoot(document.getElementById("root")!).render(
   <StrictMode>
      <BrowserRouter>
         <Background>
            <ApolloProvider client={client}>
               <App />
            </ApolloProvider>
         </Background>
      </BrowserRouter>
   </StrictMode>
);
