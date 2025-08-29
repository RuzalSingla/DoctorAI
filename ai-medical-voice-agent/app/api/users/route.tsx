import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const user = await currentUser();

  if (!user || !user.primaryEmailAddress?.emailAddress) {
    return NextResponse.json({ error: "User email is missing" }, { status: 400 });
  }

  try {
    // check if user already exists
    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, user.primaryEmailAddress.emailAddress));

    // if not then create new user
    if (users.length === 0) {
      const result = await db
        .insert(usersTable)
        .values({
          name: user.fullName || "",
          email: user.primaryEmailAddress.emailAddress,
          credits: 10,
        })
        .returning({
          id: usersTable.id,
          name: usersTable.name,
          email: usersTable.email,
          credits: usersTable.credits,
        });

      return NextResponse.json(result[0]); // ✅ directly return inserted row
    }

    return NextResponse.json(users[0]); // ✅ return existing user
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Something went wrong", details: e });
  }
}

