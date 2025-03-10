import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const plan = await db.nutritionPlan.findUnique({
      where: {
        id: params.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!plan) {
      return NextResponse.json(
        { error: "Nutrition plan not found" },
        { status: 404 }
      )
    }

    // Check if user is authorized to view this plan
    if (
      plan.userId !== session.user.id &&
      session.user.role !== "NUTRITIONIST" &&
      session.user.role !== "ADMIN"
    ) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    return NextResponse.json(plan)
  } catch (error) {
    console.error("Error fetching nutrition plan:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || session.user.role !== "NUTRITIONIST") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { planDetails, status } = await req.json()

    if (!planDetails) {
      return NextResponse.json(
        { error: "Plan details are required" },
        { status: 400 }
      )
    }

    const updatedPlan = await db.nutritionPlan.update({
      where: {
        id: params.id,
      },
      data: {
        planDetails,
        status: status || "COMPLETED",
        nutritionistId: session.user.id,
      },
    })

    return NextResponse.json(updatedPlan)
  } catch (error) {
    console.error("Error updating nutrition plan:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || session.user.role !== "NUTRITIONIST") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { status } = await req.json()

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      )
    }

    const updatedPlan = await db.nutritionPlan.update({
      where: {
        id: params.id,
      },
      data: {
        status,
        nutritionistId: session.user.id,
      },
    })

    return NextResponse.json(updatedPlan)
  } catch (error) {
    console.error("Error updating nutrition plan status:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}