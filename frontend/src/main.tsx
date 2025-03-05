import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import Background from "./components/Background.tsx";

createRoot(document.getElementById("root")!).render(
   <StrictMode>
      <BrowserRouter>
         <Background>
            <App />
         </Background>
      </BrowserRouter>
   </StrictMode>
);
