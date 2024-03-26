import { checkRole } from "@/utils/roles";
import { redirect } from "next/navigation";
import CreatePostForm from "../[postId]/components/create-post-form";
import prismadb from "@/lib/prismadb";

const AdminDashboard = async ({
  params
}: {
  params: { postId: string }
}) => {
  const [product, categories] = await Promise.all([
    prismadb.post.findUnique({
      where: {
        id: params.postId
      },
      include: {
        images: true
      }
    }),
    prismadb.category.findMany({})
  ])

  if (!checkRole("admin")) redirect('/')

  return (
    <div className="p-8 pt-6">
      <CreatePostForm
        initialData={product}
        categories={categories}
      />
    </div>
  );
}

export default AdminDashboard