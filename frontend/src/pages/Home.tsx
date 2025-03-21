import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import { MdLogout } from "react-icons/md";
import TransactionForm from "../components/TransactionForm";
import Cards from "../components/Cards";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "@apollo/client";
import { LOGOUT } from "../graphql/mutations/user.mutation";
import { GET_TRANSACTION_STATISTICS } from "../graphql/queries/transaction.query";
import { useEffect, useState } from "react";
import { GET_AUTH_USER } from "../graphql/queries/user.query";

ChartJS.register(ArcElement, Tooltip, Legend);

type ChartDataType = {
   labels: string[];
   datasets: {
      label: string;
      data: unknown[];
      backgroundColor: string[];
      borderColor: string[];
      borderWidth: number;
      borderRadius: number;
      spacing: number;
      cutout: number;
   }[];
};

function HomePage() {
   const { data } = useQuery(GET_TRANSACTION_STATISTICS);
   const { data: user } = useQuery(GET_AUTH_USER);
   console.log("USER:", user);

   const [chartData, setChartData] = useState<ChartDataType>({
      labels: [],
      datasets: [
         {
            label: "$",
            data: [],
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1,
            borderRadius: 30,
            spacing: 10,
            cutout: 130,
         },
      ],
   });

   useEffect(() => {
      if (data?.categoryStatistics) {
         const categories = data.categoryStatistics.map(
            (stat: { category: string }) => stat.category
         );
         const totalAmounts = data.categoryStatistics.map(
            (stat: { totalAmount: number }) => stat.totalAmount
         );

         const backgroundColors: string[] = [];
         const borderColors: string[] = [];

         categories.forEach((category: string) => {
            if (category === "saving") {
               backgroundColors.push("rgba(75, 192, 192)");
               borderColors.push("rgba(75, 192, 192)");
            } else if (category === "expense") {
               backgroundColors.push("rgba(255, 99, 132)");
               borderColors.push("rgba(255, 99, 132)");
            } else if (category === "investment") {
               backgroundColors.push("rgba(54, 162, 235)");
               borderColors.push("rgba(54, 162, 235)");
            }
         });

         setChartData((prev) => ({
            labels: categories,
            datasets: [
               {
                  ...prev.datasets[0],
                  data: totalAmounts,
                  backgroundColor: backgroundColors,
                  borderColor: borderColors,
               },
            ],
         }));
      }
   }, [data]);

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
      <>
         <div className="flex flex-col gap-6 items-center max-w-7xl mx-auto z-20 relative justify-center">
            <div className="flex items-center">
               <p className="md:text-4xl text-2xl lg:text-4xl font-bold text-center relative z-50 mb-4 mr-4 bg-gradient-to-r from-pink-600 via-indigo-500 to-pink-400 inline-block text-transparent bg-clip-text">
                  Spend wisely, track wisely
               </p>
               <img
                  src={user ? user?.authUser?.profilePicture : ""}
                  className="w-11 h-11 rounded-full border cursor-pointer"
                  alt="Avatar"
               />
               {!loading && (
                  <MdLogout
                     className="mx-2 w-5 h-5 cursor-pointer"
                     onClick={handleLogout}
                  />
               )}
               {/* loading spinner */}
               {loading && (
                  <div className="w-6 h-6 border-t-2 border-b-2 mx-2 rounded-full animate-spin"></div>
               )}
            </div>
            <div className="flex flex-wrap w-full justify-center items-center gap-6">
               <div className="h-[330px] w-[330px] md:h-[360px] md:w-[360px]  ">
                  <Doughnut data={chartData} />
               </div>

               <TransactionForm />
            </div>
            <Cards />
         </div>
      </>
   );
}
export default HomePage;
