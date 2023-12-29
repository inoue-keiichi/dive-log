import { passwordRequestSchema } from "@/schemas/account";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const body = await req.json();
  const parsedBody = passwordRequestSchema.safeParse(body);
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

  const { code, password } = parsedBody.data;

  if (code) {
    supabase.auth.exchangeCodeForSession(code);
  }

  const result = await supabase.auth.updateUser({
    password: password,
  });
  console.log(JSON.stringify(result.error));
  if (result.error && result.error.name === "AuthSessionMissingError") {
    return NextResponse.json(
      {
        errorCode: "invalid_parameter",
        message: "セッション情報がありません",
      },
      { status: 400 }
    );
  }
  if (result.error && result.error.status === 400) {
    return NextResponse.json(
      {
        errorCode: "invalid_parameter",
        message: "",
      },
      { status: 400 }
    );
  }
  if (result.error) {
    return NextResponse.json(
      {
        errorCode: "external_error",
        message: "外部エラーが発生しました。障害回復までお待ちください。",
      },
      { status: 500 }
    );
  }

  console.log(JSON.stringify(result));

  return NextResponse.json(
    {},
    {
      status: 200,
    }
  );
}
