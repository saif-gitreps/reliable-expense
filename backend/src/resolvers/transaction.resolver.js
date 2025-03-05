import Transaction from "../models/transaction.model";

const transactionResolver = {
   Query: {
      transactions: async (_, __, context) => {
         try {
            if (!context.getUser()) {
               throw new Error("Unauthenticated");
            }

            const userId = await context.getUser()._id;
            return await Transaction.find({ userId });
         } catch (error) {
            console.error(error);
            throw new Error(error.message || "Error while getting transactions");
         }
      },
      transaction: async (_, { transactionId }) => {
         try {
            return await Transaction.findById(transactionId);
         } catch (error) {
            console.error(error);
            throw new Error(error.message || "Error while getting transaction");
         }
      },
   },
   Mutation: {
      createTransaction: async (_, { input }, context) => {
         try {
            // DISABLE AUTH FOR PORTFOLIO SHOWCASE
            if (!context.getUser()) {
               throw new Error("Unauthenticated");
            }
            const userId = await context.getUser()._id;

            const transaction = new Transaction({ ...input, userId });
            await transaction.save();
            return transaction;
         } catch (error) {
            console.error(error);
            throw new Error(error.message || "Error while creating transaction");
         }
      },
      updateTransaction: async (_, { input }) => {
         try {
            return await Transaction.findByIdAndUpdate(input.transactionId, input, {
               new: true,
            });
         } catch (error) {
            console.error(error);
            throw new Error(error.message || "Error while updating transaction");
         }
      },
      deleteTransaction: async (_, { transactionId }) => {
         try {
            return await Transaction.findByIdAndDelete(transactionId);
         } catch (error) {
            console.error(error);
            throw new Error(error.message || "Error while deleting transaction");
         }
      },
   },
};

export default transactionResolver;
