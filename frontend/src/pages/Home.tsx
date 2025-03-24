import { Pie } from "react-chartjs-2";
import TransactionForm from "../components/TransactionForm";
import useHomePageChartData from "../hooks/useHomePageChartData";
import { useQuery } from "@apollo/client";
import { GET_TRANSACTIONS } from "../graphql/queries/transaction.query";
import Card, { CardProps } from "../components/Card";
import Loading from "../components/Loading";

function HomePage() {
   const { chartData } = useHomePageChartData(0);
   const { data, loading } = useQuery(GET_TRANSACTIONS, {
      variables: { limit: 4, sort: "1" },
   });

   return (
      <>
         <div className="flex space-y-5 flex-col xs:flex-row gap-6 items-center max-w-7xl mx-auto z-20  justify-center">
            <div className="flex flex-wrap w-full justify-center items-center gap-6">
               <TransactionForm />

               <div className="h-[330px] w-[330px] md:h-[360px] md:w-[360px]  ">
                  <h1 className="text-center font-bold uppercase">
                     Current Financial Distribution
                  </h1>
                  <Pie data={chartData} />
               </div>
            </div>

            <div className="w-full max-w-4xl">
               <h1 className="text-center mb-3 font-bold uppercase">
                  Recent few transactions
               </h1>
               {loading && <Loading />}
               <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 justify-center">
                  {!loading &&
                     data.transactions.map((transaction: CardProps["transaction"]) => (
                        <Card key={transaction._id} transaction={transaction} />
                     ))}

                  {!loading && data.transactions.length === 0 && (
                     <p className="text-center text-2xl font-bold">
                        No transactions found
                     </p>
                  )}
               </div>
            </div>
         </div>
      </>
   );
}
export default HomePage;
