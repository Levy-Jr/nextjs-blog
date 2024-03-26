"use client"

import { AlertModal } from "@/components/modals/alert-modal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Prisma } from "@prisma/client"
import axios from "axios"
import { format, getHours, getMinutes } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Edit, Trash } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

type Props = {
  data: Prisma.PostGetPayload<{
    include: {
      category: true,
      images: true
    }
  }>;
  userRole: boolean
}

const PostComponent = ({ data, userRole }: Props) => {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const onEdit = () => {
    router.push(`/admin/dashboard/posts/${data.id}`)
  }

  const onDelete = async () => {
    await axios.delete(`/api/posts/${data.id}`)
    setLoading(true)
    router.refresh()
  }

  return (
    <li className="md:flex justify-between">
      <Link
        href={`/post/${data.id}`}
        className="md:flex items-center md:space-x-4"
      >
        <div className="relative w-32 h-32">
          <Image
            fill
            src={data.images[0].url}
            className="object-cover"
            alt="Imagem"
          />
        </div>
        <div className="space-y-2">
          <h3 className="font-bold text-lg">{data.title}</h3>
          <Badge style={{
            backgroundColor: data.category.value
          }} >{data.category.name}</Badge>
          <p className="text-sm truncate max-w-md">
            {data.content}
          </p>
          <p className="text-xs text-slate-800">
            Criado {format(data.createdAt, "EEEE',' dd 'de' MMMM 'de' yyyy", {
              locale: ptBR
            })} às {getHours(data.createdAt)}:{getMinutes(data.createdAt)}
          </p>
        </div>
      </Link>

      {userRole &&
        <>
          <AlertModal
            isOpen={open}
            onClose={() => setOpen(false)}
            onConfirm={onDelete}
            loading={loading}
          />
          <div className="flex gap-4 mt-4 md:mt-0">
            <Button className="bg-green-400 hover:bg-green-600" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="destructive" onClick={() => setOpen(true)}>
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </>
      }
    </li>
  )
}

export default PostComponent