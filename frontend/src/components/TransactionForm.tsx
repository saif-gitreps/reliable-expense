import { useMutation } from "@apollo/client";
import { CREATE_TRANSACTION } from "../graphql/mutations/transaction.mutation";
import toast from "react-hot-toast";

type TransactionData = {
   description: string;
   paymentType: string;
   category: string;
   amount: number;
   location: string;
   date: string;
};

function TransactionForm() {
   const [createTransaction, { loading }] = useMutation(CREATE_TRANSACTION, {
      refetchQueries: ["GetTransactions", "GetTransactionStatistics"],
   });

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);

      const transactionData: TransactionData = {
         description: formData.get("description") as string,
         paymentType: formData.get("paymentType") as string,
         category: formData.get("category") as string,
         amount: parseFloat(formData.get("amount") as string) as number,
         location: formData.get("location") as string,
         date: formData.get("date") as string,
      };
      console.log("transactionData", transactionData);

      try {
         await createTransaction({ variables: { input: transactionData } });

         form.reset();
         toast.success("Transaction created successfully");
      } catch (error) {
         console.log("Error: ", error);
         toast.error("Failed to create transaction");
      }
   };

   return (
      <form className="w-full max-w-lg flex flex-col gap-5 px-3" onSubmit={handleSubmit}>
         <div className="flex flex-wrap">
            <div className="w-full">
               <label
                  className="block uppercase tracking-wide text-gray-800 text-xs font-bold mb-2"
                  htmlFor="description"
               >
                  Add a Transaction
               </label>
               <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="description"
                  name="description"
                  type="text"
                  required
                  placeholder="Rent, Income, Car payment etc."
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
               />
            </div>
         </div>

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
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border  rounded py-[11px] px-4 mb-3 leading-tight focus:outline-none
						 focus:bg-white"
                  placeholder="Select date"
               />
            </div>
         </div>

         <button
            className="text-white font-bold w-full rounded px-4 py-2 bg-gradient-to-br
          bg-black hover:cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            type="submit"
            disabled={loading}
         >
            {loading ? "Loading..." : "Add Transaction"}
         </button>
      </form>
   );
}

export default TransactionForm;
