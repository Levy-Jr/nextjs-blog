"use client"

import { AlertModal } from "@/components/modals/alert-modal"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { Comment } from "@prisma/client"
import axios from "axios"
import { Edit, Trash } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"

const formSchema = z.object({
  text: z.string().min(1, {
    message: "O comentário não pode ser deixado em branco"
  })
})

type EditCommentFormValue = z.infer<typeof formSchema>

type CommentAdminProps = {
  comment: Comment
}

const CommentAdmin = ({ comment }: CommentAdminProps) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const params = useParams()
  const router = useRouter()

  const form = useForm<EditCommentFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: comment.text
    }
  })

  const onDelete = async () => {
    try {
      setLoading(true)
      await axios.delete(`/api/posts/${params.postId}/comment/${comment.id}`)
      toast.success("Comentário excluído.")
      router.refresh()
    } catch (error) {
      toast.error("Algo deu errado.")
    } finally {
      setLoading(false)
    }
  }

  const onEdit = async (data: EditCommentFormValue) => {
    try {
      setLoading(true)
      await axios.patch(`/api/posts/${params.postId}/comment/${comment.id}`, data)
      router.refresh()
      toast.success("Comentário editado.")
    } catch (error) {
      toast.error("Algo deu errado.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex gap-4 mt-4 md:mt-0">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-green-400 hover:bg-green-600">
              <Edit className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <Form {...form}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar comentário</DialogTitle>
                <DialogDescription>Clique em editar quando você estiver pronto.</DialogDescription>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(onEdit)} className="grid gap-4 py-4">
                <div className="">
                  <FormField
                    control={form.control}
                    name="text"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            disabled={loading}
                            className="w-full"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter>
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Form>
        </Dialog>
        <Button variant="destructive" onClick={() => setOpen(true)}>
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </>
  )
}

export default CommentAdmin