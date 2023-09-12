import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

// export async function middleware(req: NextRequest) {
//   console.log("middleware");
//   const res = NextResponse.next();
//   const supabase = createMiddlewareClient({ req, res });
//   const result = await supabase.auth.getUser();
//   console.log(result.data.user);
//   if (result.data.user) {
//     return res;
//   }

//   if (req.nextUrl.pathname.startsWith("/diveLogs")) {
//     const redirectUrl = req.nextUrl.clone();
//     redirectUrl.pathname = "/";
//     redirectUrl.searchParams.set(`redirectedFrom`, req.nextUrl.pathname);
//     return NextResponse.redirect(redirectUrl);
//   }

//   // root
//   return res;
// }

export async function middleware(req: NextRequest) {
  console.log("middleware");
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // if user is signed in and the current path is / redirect the user to /account
  if (user && req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/diveLogs", req.url));
  }

  // if user is not signed in and the current path is not / redirect the user to /
  if (!user && req.nextUrl.pathname !== "/") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/", "/diveLogs", "/diveLogs/(.*)"],
};
