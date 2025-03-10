import { gql } from "@apollo/client";

export const GET_AUTH_USER = gql`
   query GetAuthenticatedUser {
      authUser {
         _id
         username
      }
   }
`;
