import { db } from "@/config/db";
import { openai } from "@/config/OpenAiModel";
import { SessionChatTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

const REPORT_GEN_PROMPT=`You are an AI Medical Voice Agent that just finished a conversation with a user. Based on doctor AI agent info and Conversation between AI medical agent and user, generate a structured report on the following field:

1. sessionId: a unique session identifier
2.agent: the medical specialist name (e.g., "General Physician AI")
3.user:name of the patient or "Anonymous" if not provided
4.timestamp: current date and time in ISO format
5.chiefComplaint: one-sentence summary of the main health concern
6.summary: a 2-3 sentencesummary of the main health concern
7.symptoms: list of symptoms mentioned by the user
8.duration: how long the user has experienced the symptoms
9. severity: mild,moderate, or severe
10.medicationsMentioned: list of any medications mentioned
11 recommendations: list of AI suggestions ( e.g., rest, see adoctor)
Return the result in this JSON format:
{
    "sessionId":"string",
    "agent":string,
    "user":"string"
    "timestamp":"ISO Date string",
    "chiefComplaint":"string",
    "summary":""string",
    "symptoms":["symptom1","symptom2"]
    "duration":"string"
    "severity":"string"
    "medicationsMentioned":["med1","med2"]
    "recommendations": ["rec1","rec2"]
    }
    
    Only include valid fields. Respond with nothing else.
     `
export async function POST(req:NextRequest){
    const {sessionId, sessionDetail, messages}=await req.json();

    try{
        const UserInput="AI Doctor Agent Info : "+JSON.stringify(sessionDetail)+", Conversation:"+JSON.stringify(messages);
         const completion = await openai.chat.completions.create({
                model: 'google/gemini-2.5-flash',
                messages: [
                    {role: 'system', content: REPORT_GEN_PROMPT},
                    {role: 'user', content: UserInput},
                ],
                
            });
        
            const rawResp = completion.choices[0].message.content;
            //@ts-ignore
            const Resp = rawResp.trim().replace(/```json/g, '').replace(/```/g, '').trim();
            const JSONResp = JSON.parse(Resp);
            

            //save to database
            const result = await db.update(SessionChatTable).set({
                report:JSONResp,
                conversation:messages
            }).where(eq(SessionChatTable.sessionId,sessionId));
            
            return NextResponse.json({
                success: true,
                report: JSONResp
            });

    } catch(e){
        console.error("Error generating report:", e);
        return NextResponse.json({
            success: false,
            error: e instanceof Error ? e.message : "Unknown error"
        }, { status: 500 });

    }
}

// GET endpoint to fetch existing report
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

        return NextResponse.json({
            success: true,
            report: session[0].report,
            hasReport: !!session[0].report
        });
    } catch (e: any) {
        console.error("API error:", e);
        return NextResponse.json({ 
            success: false,
            error: e.message 
        }, { status: 500 });
    }
}