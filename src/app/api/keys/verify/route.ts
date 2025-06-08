import { auth } from "@clerk/nextjs/server";
import { verifyKey } from "@unkey/api";
import { NextResponse } from "next/server";
import env from "~/env";

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "User is not signed in" },
      { status: 403 }
    );
  }

  const body = await req.json();

  console.log(body);

  if (!body.apiKey) {
    return NextResponse.json(
      { error: "Must provide API key" },
      { status: 422 }
    );
  }

  const unkeyApiId = env.UNKEY_API_ID;

  const { result, error } = await verifyKey({
    apiId: unkeyApiId,
    key: body.apiKey,
  });

  if (error) {
    console.error(error.message);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }

  if (!result.valid) {
    return NextResponse.json({ error: "API Key is invalid" }, { status: 400 });
  }

  return NextResponse.json({ status: 204 });
}
