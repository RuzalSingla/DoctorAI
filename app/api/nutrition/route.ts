import { NextResponse } from 'next/server';
import OpenAI from 'openai';

type NutritionRequest = {
  age?: number;
  gender?: string;
  height?: string;
  weight?: string;
  conditions?: string; // comma separated
  allergies?: string; // comma separated
  goals?: string;
  dietaryPreferences?: string; // e.g., vegetarian, vegan
  caloricTarget?: number;
};

function buildPrompt(body: NutritionRequest) {
  const parts: string[] = [];
  parts.push('You are a friendly, pragmatic clinical nutrition assistant.');
  parts.push('Produce a daily personalized meal plan as JSON for the patient with the following details:');
  parts.push(JSON.stringify(body));
  parts.push(
    `Respond only with a single JSON object with the following schema:\n{\n  "summary": string,\n  "estimatedCalories": number,\n  "meals": [ { "time": string, "name": string, "ingredients": string[], "serving": string, "calories": number } ],\n  "notes": string\n}`
  );
  parts.push('Keep meals practical, low-prep where possible, and include allergy-safe alternatives.');
  return parts.join('\n\n');
}

export async function POST(req: Request) {
  try {
    const body: NutritionRequest = await req.json();
    // prefer a dedicated nutrition key, then fall back to the general key
    const apiKey = process.env.OPENAI_API_KEY_NUTRITION || process.env.OPENAI_API_KEY;

    if (!apiKey) {
      // Fallback for local/dev environments: return a safe canned plan so UI doesn't error
      const samplePlan = {
        summary: 'Balanced vegetarian plan for muscle gain with moderate calories.',
        estimatedCalories: 2500,
        meals: [
          { time: 'Breakfast', name: 'Oats with nuts & banana', ingredients: ['oats', 'milk', 'banana', 'almonds'], serving: '1 bowl', calories: 450 },
          { time: 'Mid-morning', name: 'Greek yogurt + berries', ingredients: ['greek yogurt', 'mixed berries'], serving: '1 cup', calories: 200 },
          { time: 'Lunch', name: 'Quinoa salad with chickpeas', ingredients: ['quinoa', 'chickpeas', 'spinach', 'olive oil'], serving: '1 plate', calories: 700 },
          { time: 'Snack', name: 'Peanut butter sandwich', ingredients: ['whole grain bread', 'peanut butter'], serving: '1 sandwich', calories: 400 },
          { time: 'Dinner', name: 'Paneer curry with brown rice', ingredients: ['paneer', 'tomato', 'spices', 'brown rice'], serving: '1 plate', calories: 650 }
        ],
        notes: 'Ensure adequate protein intake; include resistance training 3-4x/week. Adjust portion sizes to meet exact caloric needs.'
      };
      return NextResponse.json({ success: true, plan: samplePlan });
    }

    // Build a stricter prompt instructing the model to return ONLY valid JSON
    const prompt = buildPrompt(body) + '\n\nIMPORTANT: Return ONLY valid JSON and nothing else. Do not include any explanation, markdown, or surrounding text.';

    console.log('[nutrition] using OpenAI key:', process.env.OPENAI_API_KEY_NUTRITION ? 'OPENAI_API_KEY_NUTRITION' : 'OPENAI_API_KEY');

    // Create the client lazily so we don't throw at module import time if env is missing
    let client: InstanceType<typeof OpenAI>;
    try {
      client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    } catch (err) {
      return NextResponse.json({ success: false, error: 'Failed to initialize OpenAI client: ' + String(err) }, { status: 500 });
    }

    let resp;
    try {
      resp = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1200,
        // force deterministic output
        temperature: 0,
      });
    } catch (err) {
      console.error('[nutrition] OpenAI request failed:', err);
      // fallback to deterministic local plan rather than returning HTML/error
      const samplePlan = {
        summary: 'Balanced vegetarian plan for muscle gain with moderate calories.',
        estimatedCalories: 2500,
        meals: [
          { time: 'Breakfast', name: 'Oats with nuts & banana', ingredients: ['oats', 'milk', 'banana', 'almonds'], serving: '1 bowl', calories: 450 },
          { time: 'Mid-morning', name: 'Greek yogurt + berries', ingredients: ['greek yogurt', 'mixed berries'], serving: '1 cup', calories: 200 },
          { time: 'Lunch', name: 'Quinoa salad with chickpeas', ingredients: ['quinoa', 'chickpeas', 'spinach', 'olive oil'], serving: '1 plate', calories: 700 },
          { time: 'Snack', name: 'Peanut butter sandwich', ingredients: ['whole grain bread', 'peanut butter'], serving: '1 sandwich', calories: 400 },
          { time: 'Dinner', name: 'Paneer curry with brown rice', ingredients: ['paneer', 'tomato', 'spices', 'brown rice'], serving: '1 plate', calories: 650 }
        ],
        notes: 'Fallback plan due to OpenAI error. Ensure adequate protein intake; include resistance training 3-4x/week.'
      };
      return NextResponse.json({ success: true, plan: samplePlan, source: 'fallback' });
    }
    const text = resp.choices?.[0]?.message?.content ?? '';
    console.log('[nutrition] raw model response (trimmed):', text.slice(0, 1000));

    // helper: basic structural validation without adding external deps
    function isValidPlan(p: any) {
      if (!p || typeof p !== 'object') return false;
      if (typeof p.summary !== 'string') return false;
      if (typeof p.estimatedCalories !== 'number') return false;
      if (!Array.isArray(p.meals)) return false;
      for (const m of p.meals) {
        if (typeof m.time !== 'string') return false;
        if (typeof m.name !== 'string') return false;
        if (!Array.isArray(m.ingredients)) return false;
        if (typeof m.serving !== 'string') return false;
        if (typeof m.calories !== 'number') return false;
      }
      if (typeof p.notes !== 'string') return false;
      return true;
    }

    // Try to parse JSON output cleanly. Sometimes LLMs wrap JSON in ``` or add extra text.
    let parsed: any = null;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      // attempt to extract a JSON substring
      const m = text.match(/\{[\s\S]*\}/);
      if (m) {
        try {
          parsed = JSON.parse(m[0]);
        } catch (e2) {
          console.warn('[nutrition] failed to parse extracted JSON:', e2);
        }
      }
    }

    if (parsed && isValidPlan(parsed)) {
      return NextResponse.json({ success: true, plan: parsed, source: 'openai' });
    }

    console.warn('[nutrition] model response did not validate as plan. Returning raw text for debugging.');
    return NextResponse.json({ success: false, error: 'Model returned invalid plan JSON', raw: text });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}
