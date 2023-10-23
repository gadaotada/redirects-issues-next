import { NextResponse } from "next/server";

export const middleware = async (request) => {
  const path = request.nextUrl.pathname;
  console.log(path);

  const isPublicPath =
    path === "/login" || path === "/register" || path === "/";
  const token = request.cookies.get("token")?.value || "";

  if (isPublicPath && token && path !== "/") {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  if (!isPublicPath && token) {
    //this should make the user get redirected to the dashboard, as it isnt a public path, and yet he already has his token!
    return NextResponse.next();
  }

  if (!isPublicPath && !token) {
    // remove the token cookie if it exists

    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }
};

export const config = {
  matcher: ["/", "/dashboard", "/login", "/register"],
};