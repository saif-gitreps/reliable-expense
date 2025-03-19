import { FaLocationDot } from "react-icons/fa6";
import { BsCardText } from "react-icons/bs";
import { MdOutlinePayments } from "react-icons/md";
import { FaSackDollar } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { HiPencilAlt } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { GET_TRANSACTIONS } from "../graphql/queries/transaction.query";
import { formatDate } from "../lib/formatDate";
import { DELETE_TRANSACTION } from "../graphql/mutations/transaction.mutation";
import toast from "react-hot-toast";
import { GET_AUTH_USER, GET_USER_AND_TRANSACTIONS } from "../graphql/queries/user.query";

function Cards() {
   const { data, loading } = useQuery(GET_TRANSACTIONS);
   const { data: user } = useQuery(GET_AUTH_USER);
   const { data: userAndTransaction } = useQuery(GET_USER_AND_TRANSACTIONS, {
      variables: {
         userId: user?.authUser._id,
      },
   });

   if (loading) {
      return <p>Loading...</p>;
   }

   return (
      <div className="w-full px-10 min-h-[40vh]">
         <p className="text-5xl font-bold text-center my-10">History</p>
         <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-start mb-20">
            {!loading &&
               data.transactions.map((transaction: CardProps["transaction"]) => (
                  <Card key={transaction._id} transaction={transaction} authUser={user.} />
               ))}

            {!loading && data.transactions.length === 0 && (
               <p className="text-center text-2xl font-bold">No transactions found</p>
            )}
         </div>
      </div>
   );
}

const categoryColorMap = {
   Saving: "from-green-700 to-green-400",
   Expense: "from-pink-800 to-pink-600",
   Investment: "from-blue-700 to-blue-400",
};

type CardProps = {
   transaction: {
      _id: string;
      description: string;
      paymentType: string;
      category: string;
      amount: string;
      location: string;
      date: string;
      user: {
         name: string;
         username: string;
         profilePicture: string;
      };
   };
};

function Card({ transaction }: CardProps) {
   let { category, date, description } = transaction;
   const { amount, location, paymentType } = transaction;

   description = description[0].toUpperCase() + description.slice(1);
   category = category[0]?.toUpperCase() + category.slice(1);
   date = formatDate(date);

   const cardClass = categoryColorMap[category as keyof typeof categoryColorMap];

   const [deleteTransaction, { loading }] = useMutation(DELETE_TRANSACTION, {
      refetchQueries: ["GetTransaction", "GetTransactionStatistics"],
   });
   const handleDelete = async () => {
      try {
         await deleteTransaction({ variables: { transactionId: transaction._id } });
         toast.success("Transaction deleted successfully");
      } catch (error) {
         console.log("Error deleintg transactions: ", error);
         toast.error("Something went wrong while deleting");
      }
   };

   return (
      <div className={`rounded-md p-4 bg-gradient-to-br ${cardClass}`}>
         <div className="flex flex-col gap-3">
            <div className="flex flex-row items-center justify-between">
               <h2 className="text-lg font-bold text-white">{category}</h2>
               <div className="flex items-center gap-2">
                  {!loading && (
                     <FaTrash className={"cursor-pointer"} onClick={handleDelete} />
                  )}
                  {loading && <div> deleting..</div>}
                  <Link to={`/transaction/${transaction._id}`}>
                     <HiPencilAlt className="cursor-pointer" size={20} />
                  </Link>
               </div>
            </div>
            <p className="text-white flex items-center gap-1">
               <BsCardText />
               Description: {description}
            </p>
            <p className="text-white flex items-center gap-1">
               <MdOutlinePayments />
               Payment Type: {paymentType}
            </p>
            <p className="text-white flex items-center gap-1">
               <FaSackDollar />
               Amount: ${amount}
            </p>
            <p className="text-white flex items-center gap-1">
               <FaLocationDot />
               Location: {location || "Nil"}
            </p>
            <div className="flex justify-between items-center">
               <p className="text-xs text-black font-bold">{date}</p>
               <img
                  src={"https://tecdn.b-cdn.net/img/new/avatars/2.webp"}
                  className="h-8 w-8 border rounded-full"
                  alt=""
               />
            </div>
         </div>
      </div>
   );
}

export default Cards;
