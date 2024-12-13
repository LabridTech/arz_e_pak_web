// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

export default NextAuth({
  providers: [
   CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Fetch all users from Firebase Realtime Database
          const response = await axios.get(
            "https://are-z-pak-default-rtdb.asia-southeast1.firebasedatabase.app/person.json"
          );
      
          const users = response.data;
      
          if (!users) {
            throw new Error("No users found in the database.");
          }
      
          // Find the specific user by email
          const user = Object.values(users).find(
            (user) => user.email === credentials.email
          );
      
          if (!user) {
            throw new Error("No user found with the entered email.");
          }
      
          // Verify password
          if (user.password !== credentials.password) {
            throw new Error("Password does not match.");
          }
      
          // Return the user object
          return { id: user.id, name: user.name, email: user.email };
        } catch (error) {
          throw new Error(`Authentication failed: ${error.message}`);
        }
      }
    }),
  ],
  session: {
    jwt: true,
  },
  pages: {
    signIn: "/signin",
    error: "/auth/error", // Optional error page
  },
});
