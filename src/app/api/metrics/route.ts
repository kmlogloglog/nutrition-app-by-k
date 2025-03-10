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

    const body = await req.json()
    const { weight, bodyFat, waist, chest, arms, thighs, notes } = body

    if (!weight) {
      return NextResponse.json(
        { error: "Weight is required" },
        { status: 400 }
      )
    }

    const metrics = await db.metrics.create({
      data: {
        userId: session.user.id,
        weight,
        bodyFat,
        waist,
        chest,
        arms,
        thighs,
        notes,
      },
    })

    return NextResponse.json(metrics)
  } catch (error) {
    console.error("Error creating metrics:", error)
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

    const metrics = await db.metrics.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        date: "asc",
      },
    })

    return NextResponse.json(metrics)
  } catch (error) {
    console.error("Error fetching metrics:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}