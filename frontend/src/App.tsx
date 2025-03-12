import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Transaction from "./pages/Transaction";
import _404 from "./pages/_404";
import Header from "./components/Header";
import { useQuery } from "@apollo/client";
import { GET_AUTH_USER } from "./graphql/queries/user.query";
import { Toaster } from "react-hot-toast";

function App() {
   const { loading, data } = useQuery(GET_AUTH_USER);

   if (loading) return <p>Loading...</p>;

   return (
      <>
         {data?.authUser && <Header />}
         <Routes>
            <Route
               path="/"
               element={data.authUser ? <Home /> : <Navigate to="/login" />}
            />
            <Route
               path="/login"
               element={!data.authUser ? <Login /> : <Navigate to="/" />}
            />
            <Route
               path="/signup"
               element={!data.authUser ? <SignUp /> : <Navigate to="/" />}
            />
            <Route
               path="/transaction/:id"
               element={data.authUser ? <Transaction /> : <Navigate to="/login" />}
            />
            <Route path="*" element={<_404 />} />
         </Routes>
         <Toaster />
      </>
   );
}
export default App;
