import { MacroCalculator } from "@/components/calculator/MacroCalculator"

export default function CalculatorPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Macro Calculator
        </h1>
        <p className="mt-4 text-xl text-gray-500">
          Calculate your daily macronutrient needs based on your goals
        </p>
      </div>

      <MacroCalculator />

      <div className="mt-16 bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">How to Use Your Macros</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Understanding Macronutrients</h3>
            <p className="text-gray-600">
              Macronutrients are the nutrients your body needs in large amounts: proteins, carbohydrates, and fats. Each plays a vital role in your health and fitness goals.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium">Protein (4 calories per gram)</h3>
            <p className="text-gray-600">
              Protein is essential for muscle repair and growth. Good sources include lean meats, fish, eggs, dairy, and plant-based options like legumes and tofu.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium">Carbohydrates (4 calories per gram)</h3>
            <p className="text-gray-600">
              Carbs are your body's primary energy source. Focus on complex carbohydrates like whole grains, fruits, vegetables, and legumes.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium">Fats (9 calories per gram)</h3>
            <p className="text-gray-600">
              Healthy fats are crucial for hormone production and nutrient absorption. Include sources like avocados, nuts, seeds, and olive oil.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium">Tracking Your Macros</h3>
            <p className="text-gray-600">
              Use a food tracking app to monitor your daily intake. Aim to get within 5-10% of your targets each day, and adjust based on your results over time.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}