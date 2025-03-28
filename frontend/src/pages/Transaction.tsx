import { useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
   GET_TRANSACTION,
   GET_TRANSACTION_STATISTICS,
} from "../graphql/queries/transaction.query";
import { UPDATE_TRANSACTION } from "../graphql/mutations/transaction.mutation";
import toast from "react-hot-toast";
import Loading from "../components/Loading";

function Transaction() {
   const { id } = useParams();
   const { loading, data } = useQuery(GET_TRANSACTION, {
      variables: { id },
   });

   console.log("Transaction", data);

   const [updateTransaction, { loading: loadingUpdate }] = useMutation(
      UPDATE_TRANSACTION,
      {
         // https://github.com/apollographql/apollo-client/issues/5419 => refetchQueries is not working, and here is how we fixed it
         refetchQueries: [{ query: GET_TRANSACTION_STATISTICS }],
      }
   );

   const [formData, setFormData] = useState({
      description: data?.transaction?.description || "",
      paymentType: data?.transaction?.paymentType || "",
      category: data?.transaction?.category || "",
      amount: data?.transaction?.amount || "",
      location: data?.transaction?.location || "",
      date: data?.transaction?.date || "",
   });

   useEffect(() => {
      if (data) {
         setFormData({
            description: data?.transaction?.description,
            paymentType: data?.transaction?.paymentType,
            category: data?.transaction?.category,
            amount: data?.transaction?.amount,
            location: data?.transaction?.location,
            date: new Date(+data.transaction.date).toISOString().substr(0, 10),
         });
      }
   }, [data]);

   const navigate = useNavigate();

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
         await updateTransaction({
            variables: {
               input: {
                  ...formData,
                  amount: parseFloat(formData.amount),
                  transactionId: id,
               },
            },
         });
         toast.success("Transaction updated successfully");
         navigate("/");
      } catch (error) {
         console.log("Error: ", error);
         toast.error("Failed to update transaction");
      }
   };

   const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
   ) => {
      const { name, value } = e.target;
      setFormData((prevFormData) => ({
         ...prevFormData,
         [name]: value,
      }));
   };

   if (loading) return <Loading />;

   return (
      <div className="h-screen max-w-4xl mx-auto flex flex-col items-center">
         <form
            className="w-full max-w-lg flex flex-col gap-5 px-3"
            onSubmit={handleSubmit}
         >
            <div className="flex flex-wrap">
               <div className="w-full">
                  <label
                     className="block uppercase tracking-wide text-gray-800 text-lg font-bold mb-2"
                     htmlFor="description"
                  >
                     Update this transaction:
                  </label>
                  <input
                     className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                     id="description"
                     name="description"
                     type="text"
                     placeholder="Rent, Groceries, Salary, etc."
                     value={formData.description}
                     onChange={handleInputChange}
                  />
               </div>
            </div>

            <div className="flex flex-wrap gap-3">
               <div className="w-full flex-1 mb-6 md:mb-0">
                  <label
                     className="block uppercase tracking-wide text-gray-800 text-xs font-bold mb-2"
                     htmlFor="paymentType"
                  >
                     Payment Type
                  </label>
                  <div className="relative">
                     <select
                        className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        id="paymentType"
                        name="paymentType"
                        onChange={handleInputChange}
                        defaultValue={formData.paymentType}
                     >
                        <option value={"card"}>Card</option>
                        <option value={"cash"}>Cash</option>
                     </select>
                     <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg
                           className="fill-current h-4 w-4"
                           xmlns="http://www.w3.org/2000/svg"
                           viewBox="0 0 20 20"
                        >
                           <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                     </div>
                  </div>
               </div>

               <div className="w-full flex-1 mb-6 md:mb-0">
                  <label
                     className="block uppercase tracking-wide text-gray-800 text-xs font-bold mb-2"
                     htmlFor="category"
                  >
                     Category
                  </label>
                  <div className="relative">
                     <select
                        className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        id="category"
                        name="category"
                        onChange={handleInputChange}
                        defaultValue={formData.category}
                     >
                        <option value={"saving"}>Saving</option>
                        <option value={"expense"}>Expense</option>
                        <option value={"investment"}>Investment</option>
                     </select>
                     <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg
                           className="fill-current h-4 w-4"
                           xmlns="http://www.w3.org/2000/svg"
                           viewBox="0 0 20 20"
                        >
                           <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                     </div>
                  </div>
               </div>

               <div className="w-full flex-1 mb-6 md:mb-0">
                  <label
                     className="block uppercase text-gray-800 text-xs font-bold mb-2"
                     htmlFor="amount"
                  >
                     Amount($)
                  </label>
                  <input
                     className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                     id="amount"
                     name="amount"
                     type="number"
                     placeholder="150"
                     value={formData.amount}
                     onChange={handleInputChange}
                  />
               </div>
            </div>

            <div className="flex flex-wrap gap-3">
               <div className="flex flex-wrap gap-3">
                  <div className="w-full flex-1 mb-6 md:mb-0">
                     <label
                        className="block uppercase tracking-wide text-gray-800 text-xs font-bold mb-2"
                        htmlFor="location"
                     >
                        Location
                     </label>
                     <input
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                        id="location"
                        name="location"
                        type="text"
                        placeholder="New York"
                        value={formData.location}
                        onChange={handleInputChange}
                     />
                  </div>

                  <div className="w-full flex-1">
                     <label
                        className="block uppercase tracking-wide text-gray-800 text-xs font-bold mb-2"
                        htmlFor="date"
                     >
                        Date
                     </label>
                     <input
                        type="date"
                        name="date"
                        id="date"
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border  rounded py-[11px] px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                        placeholder="Select date"
                        value={formData.date}
                        onChange={handleInputChange}
                     />
                  </div>
               </div>

               <button
                  className="text-white font-bold w-full rounded px-4 py-2 bg-gradient-to-br bg-black hover:cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed rounded-2xl"
                  type="submit"
                  disabled={loadingUpdate}
               >
                  {loadingUpdate ? "Updating Transaction..." : "Update Transaction"}
               </button>
            </div>
         </form>
      </div>
   );
}

export default Transaction;
