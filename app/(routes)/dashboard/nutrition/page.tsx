import NutritionPlanner from '../../../../components/NutritionPlanner';

export const metadata = {
  title: 'Nutrition Planner',
};

export default function Page() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Nutrition Planner</h2>
      <NutritionPlanner />
    </div>
  );
}
