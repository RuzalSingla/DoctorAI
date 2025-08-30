// import { db } from "@/config/db";
// import { SessionChatTable } from "@/config/schema";
// import { currentUser } from "@clerk/nextjs/server";
// import { NextRequest, NextResponse } from "next/server";
// import { v4 as uuidv4 } from 'uuid';

// export async function POST(req:NextRequest) {
//     const{notes, selectedDoctor} = await req.json();
//     const user = await currentUser();
//     try{
//         const sessionId = uuidv4();
//         const result = await db.insert(SessionChatTable).values({
//             sessionId: sessionId,
//             createdBy: user?.primaryEmailAddress?.emailAddress,
//             notes: notes,
//             selectedDoctor: selectedDoctor,
//             createdOn: (new Date()).toString()
//             //@ts-ignore
//         }).returning({SessionChatTable})

//         return NextResponse.json(result[0]?.sessionChatTable);
//     } catch(e){
//         NextResponse.json(e);
//     }
// }

import { db } from "@/config/db";
import { SessionChatTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
import { eq } from "drizzle-orm";


export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
    }

    const result = await db
        .select()
        .from(SessionChatTable)
        .where(eq(SessionChatTable.sessionId, sessionId));

    if (!result.length) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { notes, selectedDoctor } = await req.json();
    const user = await currentUser();

    if (!user || !selectedDoctor) {
      return NextResponse.json({ error: "User or doctor missing" }, { status: 400 });
    }

    const sessionId = uuidv4();

    const result = await db.insert(SessionChatTable).values({
      sessionId: sessionId,
      createdBy: user.primaryEmailAddress?.emailAddress || "unknown",
      notes: notes,
      selectedDoctor: selectedDoctor,   // store the full doctor object as JSON
      createdOn: new Date().toISOString()
    }).returning({
      id: SessionChatTable.id,
      sessionId: SessionChatTable.sessionId,
      createdBy: SessionChatTable.createdBy,
      notes: SessionChatTable.notes,
      selectedDoctor: SessionChatTable.selectedDoctor,
      createdOn: SessionChatTable.createdOn
    });

    return NextResponse.json(result[0]);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
