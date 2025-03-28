import User from "../models/user.model.js";
import Transaction from "../models/transaction.model.js";
import bcrypt from "bcryptjs";

const userResolver = {
   Query: {
      authUser: async (_, __, context) => {
         try {
            return await context.getUser();
         } catch (error) {
            console.error(error);
            throw new Error(error.message || "Error while getting auth user");
         }
      },
      user: async (_, { userId }) => {
         try {
            return await User.findById(userId);
         } catch (error) {
            console.error(error);
            throw new Error(error.message || "Error while getting user");
         }
      },
   },
   Mutation: {
      signUp: async (_, { input }, context) => {
         try {
            const { username, name, password, gender } = input;
            if (!username || !name || !password || !gender) {
               throw new Error("Please fill in all fields");
            }

            const userExists = await User.findOne({ username });

            if (userExists) {
               throw new Error("User already exists, please login.");
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const profilePicture =
               gender === "male"
                  ? "https://avatar.iran.liara.run/public/boy"
                  : "https://avatar.iran.liara.run/public/girl";

            const user = new User({
               username,
               name,
               password: hashedPassword,
               gender,
               profilePicture,
            });

            await user.save();
            await context.login(user); // this is from graphql-passport library

            return user;
         } catch (error) {
            console.error(error);
            throw new Error(error.message || "Error while signing up");
         }
      },

      login: async (_, { input }, context) => {
         try {
            const { username, password } = input;

            if (!username || !password) {
               throw new Error("Please fill in all fields");
            }

            const { user } = await context.authenticate("graphql-local", {
               username,
               password,
            });

            await context.login(user);
            return user;
         } catch (error) {
            console.error(error);
            throw new Error(error.message || "Error while logging in");
         }
      },

      logout: async (_, __, context) => {
         try {
            await context.logout();
            context.req.session.destroy();
            context.res.clearCookie("connect.sid");
            return true;
         } catch (error) {
            console.error(error);
            return false;
         }
      },
   },
   User: {
      transactions: async (parent, _, __) => {
         try {
            return await Transaction.find({
               userId: parent._id,
            });
         } catch (error) {
            console.error(error);
            throw new Error(error.message || "Error while getting user's transaction");
         }
      },
   },
};

export default userResolver;
