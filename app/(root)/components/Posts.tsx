"use client"

import { Prisma } from "@prisma/client"
import { useMemo } from "react"
import PostComponent from "./Post";
import { useCategoryFilter } from "@/hooks/use-category-filter";

type PostsProps = {
  posts: Prisma.PostGetPayload<{
    include: {
      category: true,
      images: true
    }
  }>[];
  isUserAdmin: boolean;
}

const Posts = ({ posts, isUserAdmin }: PostsProps) => {
  const query = useCategoryFilter(state => state.category)

  const filteredPosts = useMemo(() => {
    if (posts.length > 0) {
      return posts.filter(post => (
        post.category.name.toLowerCase().includes(query.toLowerCase())
      ))
    }
  }, [posts, query])

  return (
    <ul className="mt-4 space-y-8">
      {filteredPosts &&
        filteredPosts.map(post => (
          <PostComponent
            key={post.id}
            data={post}
            userRole={isUserAdmin}
          />
        ))
      }
    </ul>
  )
}

export default Posts