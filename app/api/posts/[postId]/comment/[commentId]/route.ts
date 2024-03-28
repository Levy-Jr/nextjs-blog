import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { postId: string, commentId: string } }
) {
  try {
    const { userId } = auth()
    const body = await req.json()

    const { text } = body

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 })

    if (!text) return new NextResponse("Text is required", { status: 400 })

    if (!params.postId) return new NextResponse("Post id is required", { status: 400 })

    if (!params.commentId) return new NextResponse("Comment id is required", { status: 400 })

    const comment = await prismadb.comment.update({
      where: {
        id: params.commentId,
        postId: params.postId,
        userId
      },
      data: {
        text
      }
    })

    return NextResponse.json(comment)
  } catch (error) {
    console.log("[COMMENT_PATCH]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { postId: string, commentId: string } }
) {
  try {
    const { userId } = auth()

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 })

    if (!params.postId) return new NextResponse("Post id is required", { status: 400 })

    if (!params.commentId) return new NextResponse("Comment id is required", { status: 400 })

    const comment = await prismadb.comment.deleteMany({
      where: {
        id: params.commentId,
        postId: params.postId
      }
    })

    return NextResponse.json(comment)
  } catch (error) {
    console.log("[COMMENT_DELETE]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}