"use client"

import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { FC, useState } from 'react'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Category } from '@prisma/client'
import { Trash } from 'lucide-react'

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Não pode ser deixado em branco"
  }),
  value: z.string().min(4, {
    message: "O campo deve ter pelo menos 4 caracteres"
  }).regex(/^#/, {
    message: "O valor deve ser um código hex válido"
  })
})

type CreateCategoryFormValues = z.infer<typeof formSchema>

type CategoryFormProps = {
  initialData: Category | null;
}

const CreateCategoryForm: FC<CategoryFormProps> = ({
  initialData
}) => {
  const params = useParams()
  const router = useRouter()

  const [loading, setLoading] = useState(false)

  const title = initialData ? 'Editar categoria' : 'Criar categoria'
  const toastMessage = initialData ? 'Editado com sucesso.' : 'Criado com sucesso.'
  const action = initialData ? 'Salvar alterações' : 'Criar'

  const form = useForm<CreateCategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      ...initialData
    } : {
      name: '',
      value: ''
    }
  })

  const onSubmit = async (data: CreateCategoryFormValues) => {
    try {
      setLoading(true)
      if (initialData) {
        await axios.patch(`/api/categories/${params.categoryId}`, data)
      } else {
        await axios.post(`/api/categories`, data)
      }
      router.refresh()
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
      await axios.delete(`/api/categories/${params.categoryId}`)
      router.refresh()
      toast.success("Categoria excluída.")
    } catch (error) {
      toast.error('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <h1 className="text-2xl font-bold text-center">{title}</h1>

      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            onClick={onDelete}
            className='gap-2 leading-none'
          >
            Deletar categoria
            <Trash className='h-4 w-4' />
          </Button>
        )}
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='font-bold'>Nome</FormLabel>
              <FormControl>
                <Input
                  disabled={loading}
                  placeholder="Escreva o nome da categoria" {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='value'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='font-bold'>Cor</FormLabel>
              <FormControl>
                <Input
                  disabled={loading}
                  placeholder="Código hex da cor" {...field}
                />
              </FormControl>
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

export default CreateCategoryForm