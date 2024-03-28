"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { redirect, useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"

const formSchema = z.object({
  text: z.string().min(1, {
    message: 'Não pode estar em branco'
  })
})

type CreateCommentFormValues = z.infer<typeof formSchema>

const CreateCommentForm = () => {
  const router = useRouter()
  const params = useParams()

  const [loading, setLoading] = useState(false)

  const form = useForm<CreateCommentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: ''
    }
  })

  const onSubmit = async (data: CreateCommentFormValues) => {
    try {
      setLoading(true)
      await axios.post(`/api/posts/${params.postId}/comment`, data)
      router.refresh()
      toast.success("Comentário inserido.")
    } catch (error: any) {
      if (error.response.data.toLowerCase() === 'unauthenticated') {
        return router.push('/sign-in')
      }

      toast.error('Algo deu errado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 mx-auto max-w-screen-lg'>
        <FormField
          control={form.control}
          name='text'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deixe seu comentário: </FormLabel>
              <FormControl>
                <Textarea
                  disabled={loading}
                  placeholder="Escreva um comentário"
                  className='resize-none'
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <Button type="submit">Postar</Button>
            </FormItem>
          )}
        />
      </form>
    </Form >
  )
}

export default CreateCommentForm