import { passwordSchema } from "@/schemas/account";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  const body = await req.json();
  const parsedBody = passwordSchema.safeParse(body);
  if (!parsedBody.success) {
    // TODO: エラーのレスポンス型作りたい
    return NextResponse.json(
      {
        errorCode: "invalid_parameter",
        message: JSON.parse(parsedBody.error.message),
      },
      { status: 400 }
    );
  }

  const result = await supabase.auth.updateUser({
    password: parsedBody.data.password,
  });
  if (result.error) {
    return NextResponse.json(
      {
        errorCode: "invalid_parameter",
        message: result.error.message,
      },
      { status: 400 }
    );
  }

  console.log(JSON.stringify(result));

  return NextResponse.redirect(new URL("/", req.url), {
    status: 302,
  });
}
