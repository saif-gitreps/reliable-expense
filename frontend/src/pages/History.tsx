import { useQuery } from "@apollo/client";
import { GET_TRANSACTIONS } from "../graphql/queries/transaction.query";
import Card, { CardProps } from "../components/Card";

function History() {
   const { data, loading } = useQuery(GET_TRANSACTIONS);

   if (loading) {
      return <p>Loading...</p>;
   }

   return (
      <div>
         <h1 className="text-center font-bold uppercase mb-3">All your transactions:</h1>
         <div className="w-full grid grid-cols-1 md:grid-cols-2  gap-4 justify-start mb-20">
            {!loading &&
               data.transactions.map((transaction: CardProps["transaction"]) => (
                  <Card key={transaction._id} transaction={transaction} />
               ))}

            {!loading && data.transactions.length === 0 && (
               <p className="text-center text-2xl font-bold">No transactions found</p>
            )}
         </div>
      </div>
   );
}

export default History;
