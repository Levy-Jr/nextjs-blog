import prismadb from "@/lib/prismadb";
import { checkRole } from "@/utils/roles";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request
) {
  try {
    const { userId } = auth()
    const body = await req.json()

    const { name, value } = body

    if (!checkRole('admin')) return new NextResponse('Not authorized', { status: 401 })

    if (!userId) return new NextResponse('Unauthenticated', { status: 401 })

    if (!name) return new NextResponse("Name is required", { status: 400 })

    if (!value) return new NextResponse("Value is required", { status: 400 })

    const category = await prismadb.category.create({
      data: {
        name,
        value
      }
    })

    return NextResponse.json(category)
  } catch (error) {
    console.log("[CATEGORIES_POST]", error)
    return new NextResponse("Interal error", { status: 500 })
  }
}