import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Transaction from "./pages/Transaction";
import _404 from "./pages/_404";
import Header from "./components/Header";

function App() {
   const authUser = true;
   return (
      <>
         {authUser && <Header />}
         <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/transaction/:id" element={<Transaction />} />
            <Route path="*" element={<_404 />} />
         </Routes>
      </>
   );
}
export default App;
