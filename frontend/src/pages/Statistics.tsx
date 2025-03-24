import { useMemo } from "react";
import { useQuery } from "@apollo/client";
import {
   BarChart,
   Bar,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   Legend,
   PieChart,
   Pie,
   Cell,
   LineChart,
   Line,
   ResponsiveContainer,
   AreaChart,
   Area,
   Scatter,
   ZAxis,
   ScatterChart,
} from "recharts";
import {
   GET_TRANSACTION_STATISTICS,
   GET_TRANSACTIONS,
} from "../graphql/queries/transaction.query";
import formatDate from "../lib/formatDate";
import Loading from "../components/Loading";

const COLORS = [
   "#800020", // Maroon
   "#34568B", // Light Navy Blue
   "#2F4F4F", // Dark Slate Gray (slightly dark green)
   "#6B3E23", // Deep Burgundy
   "#1B4B36", // Dark Forest Green
];

type Transaction = {
   _id: string;
   description: string;
   paymentType: string;
   category: string;
   amount: number;
   location: string;
   date: string;
   user: {
      name: string;
      username: string;
      profilePicture: string;
   };
};

function Statistics() {
   const {
      loading: statsLoading,
      error: statsError,
      data: statsData,
   } = useQuery(GET_TRANSACTION_STATISTICS);
   const {
      loading: transactionsLoading,
      error: transactionsError,
      data: transactionsData,
   } = useQuery(GET_TRANSACTIONS, {
      variables: { limit: 100, sort: "-1" },
   });

   const prepareData = useMemo(() => {
      if (!statsData || !transactionsData) return null;

      const processedTransactions = transactionsData.transactions.map(
         (transaction: Transaction) => ({
            ...transaction,
            date: formatDate(transaction.date as string),
            amount: Number(transaction.amount),
         })
      );

      const dailyTransactions = processedTransactions.reduce(
         (acc: { [key: string]: number }, transaction: Transaction) => {
            acc[transaction.date] = (acc[transaction.date] || 0) + transaction.amount;
            return acc;
         },
         {}
      );

      const dailyTransactionData = Object.entries(dailyTransactions)
         .map(([date, total]) => ({
            date,
            total,
         }))
         .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      return {
         categoryStatistics: statsData.categoryStatistics,
         dailyTransactionData,
         processedTransactions,
      };
   }, [statsData, transactionsData]);

   if (statsLoading || transactionsLoading) return <Loading />;
   if (statsError || transactionsError) return <div>Error fetching statistics</div>;

   if (!prepareData) return null;

   const { categoryStatistics, dailyTransactionData, processedTransactions } =
      prepareData;

   return (
      <div className="px-10 min-h-screen">
         <h1 className="text-center font-bold uppercase mb-4">Transaction Statistics</h1>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg shadow-md">
               <h2 className="text-xl font-semibold mb-4">Category Spending</h2>
               <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryStatistics}>
                     <CartesianGrid strokeDasharray="3 3" />
                     <XAxis dataKey="category" />
                     <YAxis />
                     <Tooltip />
                     <Legend />
                     <Bar dataKey="totalAmount" fill="#8884d8">
                        {categoryStatistics.map((_: string, index: number) => (
                           <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                           />
                        ))}
                     </Bar>
                  </BarChart>
               </ResponsiveContainer>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
               <h2 className="text-xl font-semibold mb-4">Category Distribution</h2>
               <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                     <Pie
                        data={categoryStatistics}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="totalAmount"
                        label={({ category, percent }) =>
                           `${category} ${(percent * 100).toFixed(0)}%`
                        }
                     >
                        {categoryStatistics.map((_: string, index: number) => (
                           <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                           />
                        ))}
                     </Pie>
                     <Tooltip />
                     <Legend />
                  </PieChart>
               </ResponsiveContainer>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
               <h2 className="text-xl font-semibold mb-4">Daily Transaction Totals</h2>
               <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dailyTransactionData}>
                     <CartesianGrid strokeDasharray="3 3" />
                     <XAxis dataKey="date" />
                     <YAxis />
                     <Tooltip />
                     <Legend />
                     <Line
                        type="monotone"
                        dataKey="total"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                     />
                  </LineChart>
               </ResponsiveContainer>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
               <h2 className="text-xl font-semibold mb-4">Cumulative Spending</h2>
               <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={dailyTransactionData}>
                     <CartesianGrid strokeDasharray="3 3" />
                     <XAxis dataKey="date" />
                     <YAxis />
                     <Tooltip />
                     <Area
                        type="monotone"
                        dataKey="total"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.3}
                     />
                  </AreaChart>
               </ResponsiveContainer>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
               <h2 className="text-xl font-semibold mb-4">
                  Transaction Amount Distribution
               </h2>
               <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart>
                     <CartesianGrid />
                     <XAxis type="category" dataKey="category" name="Category" />
                     <YAxis type="number" dataKey="amount" name="Amount" />
                     <ZAxis type="number" range={[100, 500]} />
                     <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                     <Scatter
                        name="Transactions"
                        data={processedTransactions}
                        fill="#8884d8"
                     />
                  </ScatterChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>
   );
}

export default Statistics;
