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
        const UserInput = "AI Doctor Agent Info : " + JSON.stringify(sessionDetail) + ", Conversation:" + JSON.stringify(messages);

        // Limit output size to avoid large token consumption (and provider 402 errors)
        const completion = await openai.chat.completions.create({
            model: 'google/gemini-2.5-flash',
            messages: [
                { role: 'system', content: REPORT_GEN_PROMPT },
                { role: 'user', content: UserInput },
            ],
            max_tokens: 1200,
            temperature: 0.2,
        });

        const rawResp = (completion as any)?.choices?.[0]?.message?.content ?? (completion as any)?.choices?.[0]?.text ?? null;
        if (!rawResp) {
            console.error('Empty response from model', { completion });
            return NextResponse.json({ success: false, error: 'Empty response from model', raw: completion }, { status: 500 });
        }

        //@ts-ignore
        const Resp = String(rawResp).trim().replace(/```json/g, '').replace(/```/g, '').trim();
        let JSONResp;
        try {
            JSONResp = JSON.parse(Resp);
        } catch (parseErr) {
            console.error('Failed to parse model output as JSON', { parseErr, raw: Resp });
            return NextResponse.json({ success: false, error: 'Failed to parse model JSON', details: String(parseErr), raw: Resp }, { status: 500 });
        }

        // save to database
        await db.update(SessionChatTable).set({
            report: JSONResp,
            conversation: messages,
        }).where(eq(SessionChatTable.sessionId, sessionId));

        return NextResponse.json({ success: true, report: JSONResp });

    } catch (e) {
        console.error("Error generating report:", e);
        const err: any = e;
        // Determine status from provider error if possible
        const status = err?.status || err?.statusCode || err?.response?.status || err?.code || 500;
        if (status === 402) {
            return NextResponse.json({
                success: false,
                error: 'Payment required / insufficient credits at OpenRouter. Visit https://openrouter.ai/settings/credits to top up or use another key/model.',
                raw: err?.response?.data ?? err?.message ?? err,
            }, { status: 402 });
        }

        return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Unknown error", raw: err?.response?.data ?? null }, { status: 500 });
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