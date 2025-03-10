import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || session?.user?.role !== "NUTRITIONIST") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { questionnaire } = await req.json()

    if (!questionnaire) {
      return NextResponse.json(
        { error: "Questionnaire data is required" },
        { status: 400 }
      )
    }

    // Format the questionnaire data for the prompt
    const prompt = `
    Create a detailed, personalized nutrition plan based on the following client information:
    
    Current Diet: ${questionnaire.currentDiet}
    Dietary Restrictions: ${questionnaire.dietaryRestrictions?.join(', ') || 'None'}
    Allergies: ${questionnaire.allergies || 'None'}
    Medical Conditions: ${questionnaire.medicalConditions || 'None'}
    Sleep Hours: ${questionnaire.sleepHours}
    Stress Level: ${questionnaire.stressLevel}
    Physical Activity Level: ${questionnaire.physicalActivityLevel}
    Workout Frequency: ${questionnaire.workoutFrequency} days per week
    Workout Types: ${questionnaire.workoutType?.join(', ') || 'None'}
    Goals: ${questionnaire.goals.join(', ')}
    Desired Timeframe: ${questionnaire.timeframe}
    Additional Information: ${questionnaire.additionalInfo || 'None'}
    
    The nutrition plan should include:
    1. Daily caloric target
    2. Macronutrient breakdown (protein, carbs, fats)
    3. Meal timing recommendations
    4. Sample meal plan for 3 days
    5. Food recommendations and alternatives
    6. Supplement recommendations (if applicable)
    7. Hydration guidelines
    8. Tips for adherence and success
    
    Format the plan in a clear, organized manner with sections and bullet points where appropriate.
    `

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a certified nutritionist with expertise in creating personalized nutrition plans."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const generatedPlan = response.choices[0].message.content

    return NextResponse.json({ plan: generatedPlan })
  } catch (error) {
    console.error("Error generating plan:", error)
    return NextResponse.json(
      { error: "Failed to generate nutrition plan" },
      { status: 500 }
    )
  }
}