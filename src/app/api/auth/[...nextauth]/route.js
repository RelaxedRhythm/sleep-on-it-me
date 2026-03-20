// import NextAuth from "next-auth";
// import { authOptions } from "../../../../auth";

// // name should be handler only for next auth route file
// const handler=NextAuth(authOptions)
// console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
// export {handler as GET, handler as POST } ;

import { handlers } from "@/auth";

export const { GET, POST } = handlers;