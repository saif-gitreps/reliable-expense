import { Link } from "react-router-dom";
import { ChartLine, History, LogOut, Plus, Wallet } from "lucide-react";
import { useMutation } from "@apollo/client";
import { LOGOUT } from "../graphql/mutations/user.mutation";
import toast from "react-hot-toast";

const Header = () => {
   const [logout, { loading, client }] = useMutation(LOGOUT, {
      refetchQueries: ["GetAuthenticatedUser"],
   });

   const handleLogout = async () => {
      try {
         await logout();
         toast.success("Logged out successfully");
         client.resetStore(); // removing cache
      } catch (error) {
         console.log(error);
         toast.error("Failed to logout");
      }
   };

   return (
      <div className="px-10 mb-5 py-2 flex justify-between items-center relative z-50 bg-gray-200 shadow-md">
         <h1 className="relative z-50 text-gray-700 text-2xl font-bold">
            <Link to="/" className="flex items-center gap-2">
               <Wallet size={36} className="stroke-amber-700" />
               TrackEazy
            </Link>
         </h1>

         <div className="flex items-center gap-1 z-50">
            <div className="space-x-0 flex font-semibold">
               <Link to="/" className="flex gap-1 items-center shadow-sm rounded-lg p-3">
                  Add <Plus size={20} className="stroke-red-800" />
               </Link>
               <Link
                  to="/history"
                  className="flex gap-1 items-center shadow-sm rounded-xl p-3"
               >
                  History <History size={20} className="stroke-blue-800" />
               </Link>
               <Link
                  to="/statistics"
                  className="flex gap-1 items-center shadow-sm rounded-xl p-3"
               >
                  Statistics <ChartLine size={20} className="stroke-green-800" />
               </Link>
            </div>

            <div className="flex gap-1 shadow-sm rounded-xl p-2">
               <LogOut
                  onClick={handleLogout}
                  size={32}
                  className="stroke-amber-800 hover:cursor-pointer hover:opacity-75"
               />

               {loading && (
                  <div className="w-6 h-6 border-t-2 border-b-2 mx-2 rounded-full animate-spin"></div>
               )}
            </div>
         </div>
      </div>
   );
};
export default Header;
