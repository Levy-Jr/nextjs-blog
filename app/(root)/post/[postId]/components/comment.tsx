import { Comment as CommentComponent } from "@prisma/client"
import CreateCommentForm from "./create-comment-form"
import CommentList from "./commentList"
import { clerkClient } from "@clerk/nextjs"

type CommentProps = {
  data: CommentComponent[]
}

const CommentComponent = ({ data }: CommentProps) => {
  const getUserName = async (id: string) => {
    const user = await clerkClient.users.getUser(id)
    if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`
    return `Usuário sem nome`
  }

  return (
    <div className='mt-28 mb-4'>
      <h2 className='text-3xl font-bold mb-4'>Comentários</h2>
      <CreateCommentForm />
      {data.map(comment => (
        <CommentList
          key={comment.id}
          userName={getUserName(comment.userId)}
          comment={comment}
        />
      ))}
    </div>
  )
}

export default CommentComponent