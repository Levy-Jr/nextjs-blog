import { checkRole } from "@/utils/roles";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";
import CreateCategoryForm from "./components/create-category-form";
import { Badge } from "@/components/ui/badge";

const AdminDashboard = async ({
  params
}: {
  params: { categoryId: string }
}) => {

  const [category, categories] = await Promise.all([
    prismadb.category.findUnique({
      where: {
        id: params.categoryId
      }
    }),
    prismadb.category.findMany({})
  ])


  if (!checkRole("admin")) redirect('/')

  return (
    <div className="mx-auto max-w-screen-lg p-8 pt-6">
      <CreateCategoryForm
        initialData={category}
      />
      {categories &&
        <>
          <h2 className="text-xl font-bold">Categorias: </h2>
          <ul className="flex flex-wrap gap-3 mt-2 cursor-default">
            {categories.map(category => (
              <li key={category.id}>
                <Badge style={{
                  backgroundColor: category.value
                }}
                >{category.name}</Badge>
              </li>
            ))
            }
          </ul>
        </>
      }
    </div>
  );
}

export default AdminDashboard