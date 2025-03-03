import { users } from "../data/data.js";

const userResolver = {
   Query: {
      users: () => {
         return users;
      },
   },
   Mutation: {},
};

export default userResolver;
