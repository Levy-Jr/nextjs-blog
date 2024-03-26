import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import prismadb from "@/lib/prismadb";
import { checkRole } from "@/utils/roles";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const AdminDashboard = async () => {
  if (!checkRole("admin")) redirect('/')
  const posts = await prismadb.post.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      images: true,
      category: true
    }
  })

  return (
    <div className="p-8 pt-6">
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/admin/dashboard/posts/create-post">Criar um novo post</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/admin/dashboard/categories/create-category">Criar uma nova categoria</Link>
        </Button>
      </div>
      <div className="mt-10">
        <h2 className="text-xl mb-4">quantidade de posts: {posts.length}</h2>
        <ul className="space-y-12">
          {posts.map(post => (
            <li key={post.id}>
              <Link className="flex gap-2" href={`/admin/dashboard/posts/${post.id}`}>
                <div className="relative w-32 h-32">
                  <Image
                    fill
                    alt={post.title}
                    className="object-cover"
                    src={post.images[0].url}
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-lg">{post.title}</h3>
                  <Badge style={{
                    backgroundColor: post.category.value
                  }}>{post.category.name}</Badge>
                  <p className="text-sm truncate max-w-md">
                    {post.content}
                  </p>
                </div>
              </Link>
            </li>
          ))
          }
        </ul>
      </div>
    </div >
  );
}

export default AdminDashboard