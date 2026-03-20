import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { client } from "./library/db";

export const runtime = "nodejs";

export const {handlers,auth,signIn,signOut} = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        identifier: { label: "username or email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        try {
          console.log("auth");
          if (!credentials) return null;
          const { identifier, password } = credentials;

           if (!identifier || !password) return null;

          const result = await client.query(
            "SELECT * from users where username=$1 LIMIT 1 ; ",
            [identifier],
          );

          console.log("query result", result);

          if (!result.rowCount) {
            // throw new Error("No user found with these credentials");
            return null;

          }

          const user = result.rows[0];
          const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password_hash,
          );

          if (!isPasswordCorrect) {
            // throw new Error("Incorrect password");
            return null;
          
          }

          return {
            id: user.id.toString(),
            fname: user.first_name,
            lname: user.last_name,
            username: user.username,
            email: user.email,
          };
        } catch (err) {
          console.log("ERROR::", err);
          // throw err;
          return null;
        }
         
      },
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.username = user.username;
        token.fname = user.fname;
        token.lname = user.lname;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.username = token.username;
        session.user.fname = token.fname;
        session.user.lname = token.lname;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 3 * 60,
  },
  jwt: {
    maxAge: 3 * 60,
  },
  page:{
    signIn:"/login",
    signOut:"/login",
  },

  trustHost: true, 
  secret: process.env.NEXTAUTH_SECRET,
});
