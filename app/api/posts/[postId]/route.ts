import prismadb from "@/lib/prismadb";
import { checkRole } from "@/utils/roles";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {

    const { userId } = auth()

    if (!checkRole('admin')) return new NextResponse("Not authorized", { status: 401 })

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 })

    if (!params.postId) return new NextResponse("Post id is required", { status: 400 })

    const post = await prismadb.post.deleteMany({
      where: {
        id: params.postId
      }
    })

    return NextResponse.json(post)
  } catch (error) {
    console.log("[POST_DELETE]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const { userId } = auth()
    const body = await req.json()

    const {
      title,
      content,
      images,
      categoryId,
    } = body

    if (!checkRole('admin')) return new NextResponse("Not authorized", { status: 401 })

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 })

    if (!categoryId) return new NextResponse("Category Id is required", { status: 400 })

    if (!images ?? !images.length) return new NextResponse("Images are required", { status: 400 })

    if (!params.postId) return new NextResponse("Post id is required", { status: 400 })

    await prismadb.post.update({
      where: {
        id: params.postId
      },
      data: {
        title,
        content,
        images: {
          deleteMany: {

          }
        },
        categoryId
      }
    })

    const post = await prismadb.post.update({
      where: {
        id: params.postId
      },
      data: {
        images: {
          createMany: {
            data: [
              ...images.map((image: { url: string }) => image)
            ]
          }
        }
      }
    })

    return NextResponse.json(post)
  } catch (error) {
    console.log("[POST_PATCH]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}