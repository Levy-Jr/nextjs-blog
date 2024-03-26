import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const { userId } = auth()
    const body = await req.json()

    const { text } = body

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 })

    if (!text) return new NextResponse("Text is required", { status: 400 })

    if (!params.postId) return new NextResponse("Post id is required", { status: 400 })

    const comment = await prismadb.comment.create({
      data: {
        postId: params.postId,
        userId,
        text
      }
    })

    return NextResponse.json(comment)
  } catch (error) {
    console.log("[COMMENT_POST]", error)
    return new NextResponse("Interal error", { status: 500 })
  }
}