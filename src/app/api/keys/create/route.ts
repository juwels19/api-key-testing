import { auth } from "@clerk/nextjs/server";
import { Unkey } from "@unkey/api";
import { NextResponse } from "next/server";
import env from "~/env";

export async function POST() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "User is not signed in" },
      { status: 403 }
    );
  }

  // We know these env variables exist because of the helper file
  const unkeyToken = env.UNKEY_ROOT_KEY;
  const unkeyApiId = env.UNKEY_API_ID;

  const unkey = new Unkey({ token: unkeyToken });

  const keyCreation = await unkey.keys.create({
    apiId: unkeyApiId,
    externalId: userId,
    prefix: "rhr_scouting",
    enabled: true,
  });

  if (keyCreation.error) {
    return NextResponse.json({ error: keyCreation.error }, { status: 500 });
  }

  return NextResponse.json({ key: keyCreation.result.key }, { status: 200 });
}
