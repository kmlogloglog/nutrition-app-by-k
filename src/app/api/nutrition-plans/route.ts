import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
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

    // Check if user has an active subscription
    const subscription = await db.subscription.findUnique({
      where: {
        userId: session.user.id,
      },
    })

    if (!subscription || subscription.status !== "active") {
      return NextResponse.json(
        { error: "Active subscription required" },
        { status: 403 }
      )
    }

    const nutritionPlan = await db.nutritionPlan.create({
      data: {
        userId: session.user.id,
        questionnaire,
        planDetails: {},
        status: "PENDING",
      },
    })

    return NextResponse.json(nutritionPlan)
  } catch (error) {
    console.error("Error creating nutrition plan:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // For nutritionists, return all plans
    if (session.user.role === "NUTRITIONIST" || session.user.role === "ADMIN") {
      const plans = await db.nutritionPlan.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      })
      return NextResponse.json(plans)
    }

    // For regular users, return only their plans
    const plans = await db.nutritionPlan.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(plans)
  } catch (error) {
    console.error("Error fetching nutrition plans:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}