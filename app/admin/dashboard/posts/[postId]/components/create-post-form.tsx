"use client"

import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import ImageUpload from '@/components/ui/image-upload'
import { FC, useState } from 'react'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Category, Image, Post } from '@prisma/client'
import { Trash } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const formSchema = z.object({
  title: z.string().min(1, {
    message: "O título não pode ser deixado em branco"
  }),
  content: z.string().min(10, {
    message: "O texto precisa de pelo menos 10 caracteres"
  }),
  images: z.object({ url: z.string() }).array(),
  categoryId: z.string().min(1, {
    message: "Selecione uma categoria"
  })
})

type CreatePostFormValues = z.infer<typeof formSchema>

type PostFormProps = {
  initialData: Post & {
    images: Image[]
  } | null
  categories: Category[]
}

const CreatePostForm: FC<PostFormProps> = ({
  initialData,
  categories
}) => {
  const params = useParams()
  const router = useRouter()

  const [loading, setLoading] = useState(false)

  const title = initialData ? 'Editar post' : 'Criar post'
  const toastMessage = initialData ? 'Editado com sucesso.' : 'Criado com sucesso.'
  const action = initialData ? 'Salvar alterações' : 'Publicar'

  const form = useForm<CreatePostFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      ...initialData
    } : {
      title: '',
      content: '',
      images: [],
      categoryId: ''
    }
  })

  const onSubmit = async (data: CreatePostFormValues) => {
    try {
      setLoading(true)
      if (initialData) {
        await axios.patch(`/api/posts/${params.postId}`, data)
      } else {
        await axios.post(`/api/posts`, data)
      }
      router.refresh()
      router.push('/admin/dashboard')
      toast.success(toastMessage)
    } catch (error) {
      toast.error('Algo deu errado')
    } finally {
      setLoading(false)
    }
  }

  const onDelete = async () => {
    try {
      setLoading(true)
      await axios.delete(`/api/posts/${params.postId}`)
      router.refresh()
      router.push(`/admin/dashboard`)
      toast.success("Post excluído.")
    } catch (error) {
      toast.error('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <h1 className="text-2xl font-bold text-center">{title}</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 mx-auto max-w-screen-lg'>
        <div className="flex justify-end">
          {initialData && (
            <Button
              disabled={loading}
              variant="destructive"
              onClick={onDelete}
              className='gap-2 leading-none self-end mt-6'
            >
              Deletar post
              <Trash className='h-4 w-4' />
            </Button>
          )}
        </div>
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='font-bold'>Título</FormLabel>
              <FormControl>
                <Input
                  disabled={loading}
                  placeholder="Escreva o título do post" {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='content'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='font-bold'>Conteúdo do post</FormLabel>
              <FormControl>
                <Textarea
                  disabled={loading}
                  placeholder="Escreva o conteúdo do post"
                  className='resize-none h-56'
                  {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='images'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='font-bold'>Imagem do post</FormLabel>
              <FormControl>
                <ImageUpload
                  value={field.value.map(image => image.url)}
                  disabled={loading}
                  onChange={url => field.onChange([...field.value, { url }])}
                  onRemove={url => field.onChange([...field.value.filter(current => current.url !== url)])}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='categoryId'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='font-bold'>Categoria do post</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-4">
          <Button type='submit'>{action}</Button>
          <Button variant="secondary" asChild>
            <Link href="/admin/dashboard">Cancelar</Link>
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default CreatePostForm