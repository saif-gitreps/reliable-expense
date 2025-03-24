import { HiPencilAlt } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import formatDate from "../lib/formatDate";
import { DELETE_TRANSACTION } from "../graphql/mutations/transaction.mutation";
import toast from "react-hot-toast";
import {
   Banknote,
   CalendarDays,
   CircleDollarSign,
   CreditCard,
   Pin,
   Text,
   Trash2,
} from "lucide-react";

const categoryColorMap = {
   Saving: "bg-green-700",
   Expense: "bg-red-800",
   Investment: "bg-amber-500",
};

export type CardProps = {
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
   console.log(date);

   const cardClass = categoryColorMap[category as keyof typeof categoryColorMap];

   const [deleteTransaction, { loading }] = useMutation(DELETE_TRANSACTION, {
      refetchQueries: ["GetTransactions", "GetTransactionStatistics"],
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
      <div className="rounded-md shadow-sm bg-gradient-to-br bg-gray-100 bg-">
         <div
            className={`flex flex-row items-center justify-between ${cardClass} rounded-t-md p-3`}
         >
            <h2 className="text-lg font-bold text-white">{category}</h2>
            <div className="flex items-center gap-2">
               {!loading && (
                  <Trash2
                     className="cursor-pointer hover:opacity-75 stroke-gray-200"
                     onClick={handleDelete}
                  />
               )}
               {loading && <div> deleting..</div>}
               <Link to={`/transaction/${transaction._id}`}>
                  <HiPencilAlt className="cursor-pointer" size={20} />
               </Link>
            </div>
         </div>
         <div className="p-4">
            <div className="flex flex-col gap-1">
               <p className="flex items-center gap-1">
                  <Text className="stroke-gray-400" />
                  Description: {description}
               </p>
               <p className="flex items-center gap-1">
                  {paymentType === "card" ? (
                     <CreditCard className="stroke-blue-500" />
                  ) : (
                     <Banknote className="stroke-green-700" />
                  )}
                  Payment Type: {paymentType}
               </p>
               <p className="flex items-center gap-1">
                  <CircleDollarSign className="stroke-green-600" />
                  Amount: ${amount}
               </p>
               <p className="flex items-center gap-1">
                  <Pin className="stroke-red-500" />
                  Location: {location || "Nil"}
               </p>
               <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1 text-xs text-black font-bold">
                     <CalendarDays className="stroke-purple-700" />
                     {date}
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

export default Card;
