import prismadb from "@/lib/prismadb"
import { checkRole } from "@/utils/roles"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function PATCH(
  req: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    const { userId } = auth()
    const body = await req.json()

    const {
      name,
      value
    } = body

    if (!checkRole('admin')) return new NextResponse("Not authorized", { status: 401 })

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 })

    if (!params.categoryId) return new NextResponse("Category id is required", { status: 400 })

    if (!name) return new NextResponse("Name is required", { status: 400 })

    if (!value) return new NextResponse("Value is required", { status: 400 })

    const category = await prismadb.category.update({
      where: {
        id: params.categoryId
      },
      data: {
        name,
        value
      }
    })

    return NextResponse.json(category)
  } catch (error) {
    console.log("[CATEGORY_PATCH]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    const { userId } = auth()

    if (!checkRole('admin')) return new NextResponse("Not authorized", { status: 401 })

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 })

    if (!params.categoryId) return new NextResponse("Category id is required", { status: 400 })

    const category = await prismadb.category.deleteMany({
      where: {
        id: params.categoryId
      }
    })

    return NextResponse.json(category)
  } catch (error) {
    console.log("[CATEGORY_DELETE]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}