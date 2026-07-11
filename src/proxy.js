// import { getToken } from "next-auth/jwt";

import {auth} from "@/auth";
import { NextResponse, NextRequest } from "next/server";

export default auth((req)=> {
  // const token = await getToken({
  //   req,
  //   secret: process.env.NEXTAUTH_SECRET,
  // });

  const isLoggedIn = !!req.auth;

  const url = req.nextUrl;

  const authFile =
    url.pathname.startsWith("/signup") || url.pathname.startsWith("/login");

  // ✅ EXCLUDE NEXTAUTH ROUTES
  if (url.pathname.startsWith("/api/auth")) {
    return NextResponse.next({
      request:{
        headers: req.headers,
      }
    });
  }

  if (isLoggedIn && authFile) {
    return NextResponse.redirect(new URL("/home", req.url));
  }
  if (!isLoggedIn && !authFile) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next({
    request:{
      headers: req.headers,
    }
  });
})

export const config = {
  matcher: ["/", "/home", "/signup", "/login", "/desk","/profile","/api"],
  // matcher:[]
};
