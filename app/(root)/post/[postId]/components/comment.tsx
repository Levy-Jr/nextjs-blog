import { Comment } from "@prisma/client"
import CreateCommentForm from "./create-comment-form"
import CommentList from "./commentList"
import { auth, clerkClient } from "@clerk/nextjs"

type CommentProps = {
  data: Comment[]
}

const CommentComponent = ({ data }: CommentProps) => {
  const { userId } = auth()

  const isCommentOwner = (id: string) => {
    if (userId === id) return true
    return false
  }

  const getUserName = async (id: string) => {
    const user = await clerkClient.users.getUser(id)
    if (user.firstName) return `${user.firstName}`
    if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`
    return `Usuário sem nome`
  }

  return (
    <div className='mt-28 mb-4'>
      <h2 className='text-3xl font-bold mb-4'>Comentários</h2>
      <CreateCommentForm />
      <ul className="my-8 space-y-6">
        {data.map(comment => (
          <CommentList
            key={comment.id}
            userName={getUserName(comment.userId)}
            isCommentOwner={isCommentOwner(comment.userId)}
            comment={comment}
          />
        ))}
      </ul>
    </div>
  )
}

export default CommentComponent