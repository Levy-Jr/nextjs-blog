import prismadb from "@/lib/prismadb";
import { checkRole } from "@/utils/roles";
import Posts from "./components/Posts";
import CategoryFilter from "@/components/Category-Filter";

const Home = async () => {
  const posts = await prismadb.post.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      images: true,
      category: true
    }
  })

  const isUserAdmin = checkRole('admin')

  return (
    <main className="p-8 pt-6">
      <div className="w-fit ml-auto">
        <CategoryFilter
          categories={posts.map(post => post.category)}
        />
      </div>
      <h1 className="text-3xl font-bold">Artigos Recentes</h1>
      <Posts
        isUserAdmin={isUserAdmin}
        posts={posts}
      />
    </main>
  );
}

export default Home