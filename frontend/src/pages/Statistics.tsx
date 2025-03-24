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
} from "recharts";
import { GET_TRANSACTION_STATISTICS } from "../graphql/queries/transaction.query";

// Color palette for charts
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

function Statistics() {
   const { loading, error, data } = useQuery(GET_TRANSACTION_STATISTICS);

   if (loading) return <div>Loading statistics...</div>;
   if (error) return <div>Error fetching statistics: {error.message}</div>;

   const categoryStatistics = data?.categoryStatistics || [];
   return (
      <div className="p-6 bg-gray-100 min-h-screen rounded-xl">
         <h1 className="text-3xl font-bold mb-6 text-center">Transaction Statistics</h1>

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
                        {categoryStatistics.map((entry, index) => (
                           <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                           />
                        ))}
                     </Bar>
                  </BarChart>
               </ResponsiveContainer>
            </div>

            {/* Pie Chart of Category Distribution */}
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
                        {categoryStatistics.map((entry, index) => (
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
         </div>
      </div>
   );
}

export default Statistics;
