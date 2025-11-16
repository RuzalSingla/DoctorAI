"use client";
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

type Plan = {
  summary?: string;
  estimatedCalories?: number;
  meals?: Array<{ time: string; name: string; ingredients: string[]; serving?: string; calories?: number }>;
  notes?: string;
  raw?: string;
};

export default function NutritionPlanner() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);

  const handleSubmit = async (e?: React.FormEvent, demo = false) => {
    if (e && 'preventDefault' in e) e.preventDefault();
    setError(null);
    setPlan(null);

    let payload: any = {};
    if (!demo) {
      // when called from the form submit, e.target is the form
      if (!e || !(e.target as unknown)) {
        setError('Form not found');
        return;
      }
      const form = new FormData(e.target as HTMLFormElement);
      payload = {
        age: form.get('age') ? Number(form.get('age')) : undefined,
        gender: form.get('gender')?.toString() || undefined,
        height: form.get('height')?.toString() || undefined,
        weight: form.get('weight')?.toString() || undefined,
        conditions: form.get('conditions')?.toString() || undefined,
        allergies: form.get('allergies')?.toString() || undefined,
        goals: form.get('goals')?.toString() || undefined,
        dietaryPreferences: form.get('dietaryPreferences')?.toString() || undefined,
        caloricTarget: form.get('caloricTarget') ? Number(form.get('caloricTarget')) : undefined,
      };
    } else {
      // demo mode: empty payload — server will return canned plan
      payload = {};
    }

    setLoading(true);
    try {
      const url = demo ? '/api/nutrition/demo' : '/api/nutrition';
      const opts: RequestInit = demo ? { method: 'GET' } : { method: 'POST', body: JSON.stringify(payload) };
      const res = await fetch(url, opts);

      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        if (!res.ok || !data.success) {
          setError(data?.error || 'Failed to generate plan');
        } else {
          setPlan(data.plan || null);
        }
      } else {
        // Non-JSON response (likely an HTML error page). Read text and show to user.
        const text = await res.text();
        setError(`Server returned non-JSON response: ${text.slice(0, 200)}`);
      }
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Nutrition Planner</CardTitle>
        <div className="text-sm text-muted-foreground">Generate a personalized meal plan powered by AI.</div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input name="age" placeholder="Age" className="input" />
          <input name="gender" placeholder="Gender" className="input" />
          <input name="height" placeholder="Height (e.g., 170cm)" className="input" />
          <input name="weight" placeholder="Weight (e.g., 70kg)" className="input" />
          <input name="conditions" placeholder="Health conditions (comma separated)" className="input col-span-2" />
          <input name="allergies" placeholder="Allergies (comma separated)" className="input col-span-2" />
          <input name="dietaryPreferences" placeholder="Dietary prefs (vegetarian/vegan/etc)" className="input" />
          <input name="caloricTarget" placeholder="Caloric target (kcal)" className="input" />
          <Textarea name="goals" placeholder="Goals (weight loss, muscle gain, maintain)" className="col-span-2" />

          <div className="col-span-2 flex gap-2">
            <Button type="submit" variant="default" disabled={loading}>
              {loading ? 'Generating…' : 'Generate Plan'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setPlan(null);
                setError(null);
              }}
            >
              Clear
            </Button>
            <Button
              type="button"
              variant="outline"
              className="ml-2"
              onClick={() => handleSubmit(undefined, true)}
              disabled={loading}
            >
              Use Demo Plan
            </Button>
          </div>
        </form>

        <div className="mt-4">
          {error && <div className="text-red-500">{error}</div>}
          {plan && (
            <div className="prose dark:prose-invert">
              {plan.summary && <h4>Summary</h4>}
              {plan.summary && <p>{plan.summary}</p>}
              {plan.estimatedCalories && <p><strong>Estimated calories:</strong> {plan.estimatedCalories} kcal</p>}

              {plan.meals && (
                <div>
                  <h4>Meals</h4>
                  <ul>
                    {plan.meals.map((m, idx) => (
                      <li key={idx} className="mb-2">
                        <strong>{m.time} — {m.name}</strong>
                        <div>{m.serving ?? ''} • {m.calories ?? ''} kcal</div>
                        <div>Ingredients: {m.ingredients.join(', ')}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {plan.notes && (
                <div>
                  <h4>Notes</h4>
                  <p>{plan.notes}</p>
                </div>
              )}

              {plan.raw && (
                <div>
                  <h4>Raw output</h4>
                  <pre className="whitespace-pre-wrap text-sm">{plan.raw}</pre>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter />
    </Card>
  );
}
