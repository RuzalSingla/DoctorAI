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
import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";

// ---------------- CREATE SESSION ----------------
export async function POST(req: NextRequest) {
  try {
    const { notes, selectedDoctor } = await req.json();
    const user = await currentUser();

    if (!user || !selectedDoctor) {
      return NextResponse.json(
        { error: "User or doctor missing" },
        { status: 400 }
      );
    }

    const sessionId = uuidv4();

    // Save to DB
    const result = await db
      .insert(SessionChatTable)
      .values({
        sessionId: sessionId,
        createdBy: user.primaryEmailAddress?.emailAddress || "unknown",
        notes: notes,
        selectedDoctor: selectedDoctor,
        createdOn: new Date().toISOString(),
      })
      .returning({
        id: SessionChatTable.id,
        sessionId: SessionChatTable.sessionId,
        createdBy: SessionChatTable.createdBy,
        notes: SessionChatTable.notes,
        selectedDoctor: SessionChatTable.selectedDoctor,
        createdOn: SessionChatTable.createdOn,
      });

    // Call Gemini 2.5 Flash via OpenRouter
    const aiResponse = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPEN_ROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: "You are a helpful medical AI assistant." },
            { role: "user", content: notes },
          ],
        }),
      }
    );

    const aiData = await aiResponse.json();

    let aiReply = "No response from AI";
    if (aiData?.choices?.[0]?.message?.content) {
      const content = aiData.choices[0].message.content;
      if (Array.isArray(content)) {
        aiReply = content
          .map((c: any) => (typeof c === "string" ? c : c.text))
          .join(" ")
          .trim();
      } else if (typeof content === "string") {
        aiReply = content;
      }
    } else if (aiData?.choices?.[0]?.text) {
      aiReply = aiData.choices[0].text;
    }

    return NextResponse.json({
      session: result[0],
      aiReply,
    });
  } catch (e: any) {
    console.error("API error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// ---------------- GET SESSION BY ID ----------------
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { error: "sessionId query param missing" },
        { status: 400 }
      );
    }

    const session = await db
      .select()
      .from(SessionChatTable)
      .where(eq(SessionChatTable.sessionId, sessionId));

    if (!session.length) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // return same shape as POST (with aiReply placeholder)
    return NextResponse.json({
      session: session[0],
      aiReply: "No AI response saved", // you can enhance this later if you want
    });
  } catch (e: any) {
    console.error("API error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
