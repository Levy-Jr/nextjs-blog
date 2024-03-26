import { checkRole } from "@/utils/roles";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from '@/lib/prismadb'

export async function GET() {
  try {
    const posts = await prismadb.post.findMany({})

    return NextResponse.json(posts)
  } catch (error) {
    console.log('[POSTS_GET]', error)
    return new NextResponse("Interal error", { status: 500 })
  }
}

export async function POST(
  req: Request
) {
  try {
    const { userId } = auth()
    const body = await req.json()

    const {
      title,
      content,
      images,
      categoryId
    } = body

    if (!checkRole("admin")) return new NextResponse("Not authorized", { status: 401 })

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 })

    if (!title) return new NextResponse("Title is required", { status: 400 })

    if (!content) return new NextResponse("Content is required", { status: 400 })

    if (!categoryId) return new NextResponse("Category ID is required", { status: 400 })

    if (!images ?? !images.length) return new NextResponse("Images are required", { status: 400 })

    const post = await prismadb.post.create({
      data: {
        userId,
        title,
        content,
        categoryId,
        images: {
          create: images
        }
      }
    })

    return NextResponse.json(post)
  } catch (error) {
    console.log("[POSTS_POST]", error)
    return new NextResponse("Interal error", { status: 500 })
  }
}