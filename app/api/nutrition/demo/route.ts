import { NextResponse } from 'next/server';

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

export async function GET() {
  return NextResponse.json({ success: true, plan: samplePlan });
}
