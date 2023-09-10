import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  console.log(`path: ${req.nextUrl.pathname}`);
  const res = NextResponse.next();
  if (req.nextUrl.pathname.startsWith("/share/")) {
    return res;
  }

  const supabase = createMiddlewareSupabaseClient({ req, res });
  const result = await supabase.auth.getSession();
  if (!result.data.session) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set(`redirectedFrom`, req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }
  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - share (guest pages)
     * - login (login page)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|share|login).*)",
  ],
};
