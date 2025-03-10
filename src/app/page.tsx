import { MacroCalculator } from '@/components/calculator/MacroCalculator'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Take Control of Your</span>
              <span className="block text-blue-600">Nutrition Journey</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Calculate your macros, track your progress, and get personalized nutrition plans
              from certified nutritionists.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link
                  href="/auth/register"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                >
                  Get Started
                </Link>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <Link
                  href="/calculator"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                >
                  Try Calculator
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
              Features
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to succeed
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <div className="text-lg leading-6 font-medium text-gray-900">
                  Macro Calculator
                </div>
                <div className="mt-2 text-base text-gray-500">
                  Get precise calculations for your daily caloric needs and macro splits
                  based on your goals.
                </div>
              </div>

              <div className="relative">
                <div className="text-lg leading-6 font-medium text-gray-900">
                  Progress Tracking
                </div>
                <div className="mt-2 text-base text-gray-500">
                  Track your measurements and see your progress over time with detailed
                  graphs and analytics.
                </div>
              </div>

              <div className="relative">
                <div className="text-lg leading-6 font-medium text-gray-900">
                  Custom Nutrition Plans
                </div>
                <div className="mt-2 text-base text-gray-500">
                  Get personalized nutrition plans created by certified nutritionists
                  based on your specific needs.
                </div>
              </div>

              <div className="relative">
                <div className="text-lg leading-6 font-medium text-gray-900">
                  Expert Support
                </div>
                <div className="mt-2 text-base text-gray-500">
                  Access to professional nutritionists who can guide you through your
                  fitness journey.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calculator Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Try Our Macro Calculator
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Get started with our free macro calculator to understand your nutritional needs.
            </p>
          </div>
          <MacroCalculator />
        </div>
      </div>
    </div>
  )
}
