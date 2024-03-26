import { format, getHours, getMinutes } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import prismadb from "@/lib/prismadb"
import Image from "next/image"
import { Fragment } from 'react'
import Comment from './components/comment'

type Props = {
  params: {
    postId: string
  }
}

const Post = async ({ params }: Props) => {
  const post = await prismadb.post.findUnique({
    where: {
      id: params.postId
    },
    include: {
      images: true,
      comments: true
    }
  })

  return (
    <div className='max-w-6xl mx-auto'>
      {post &&
        <>
          <article className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-extrabold text-center my-8">{post.title}</h1>
            <p className="text-sm text-slate-800 ml-4">Artigo criado {format(post.createdAt, "EEEE',' dd 'de' MMMM 'de' yyyy", {
              locale: ptBR
            })} às {getHours(post.createdAt)}:{getMinutes(post.createdAt)}
            </p>
            <div className="w-full h-[50rem] mt-2 mb-8 relative">
              <Image
                fill
                alt={post.title}
                className='object-contain'
                src={post.images[0].url}
              />
            </div>
            <p className="text-lg">
              {post.content.split('\n').map((line: string, index: number) => (
                <Fragment key={index}>
                  {line}
                  <br />
                </Fragment>
              ))}
            </p>
          </article>
          <Comment
            data={post.comments}
          />
        </>
      }
    </div>
  )
}

export default Post