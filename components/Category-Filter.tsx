"use client"

import { Check, ChevronsUpDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { Category } from "@prisma/client"
import { useState } from 'react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from './ui/command'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { useCategoryFilter } from '@/hooks/use-category-filter'

type CategoryFilterProps = {
  categories: Category[];
}

const CategoryFilter = ({ categories }: CategoryFilterProps) => {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const updateCategory = useCategoryFilter(state => state.updateCategory)

  const onCategorySelect = (name: string) => {
    setOpen(false)
    setName(name)
    updateCategory(name)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[15rem] justify-between"
        >
          {name
            ? categories.find((category) => category.name === name)?.name
            : "Filtrar por categoria..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[15rem] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Filtrar categoria..." />
            <CommandEmpty>Nenhuma categoria encontrada.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                onSelect={() => onCategorySelect('')}
                className='text-sm'
              >
                Nenhum filtro
              </CommandItem>
              <CommandSeparator />
              {categories.map(category => (
                <CommandItem
                  key={category.id}
                  onSelect={() => onCategorySelect(category.name)}
                  className='text-sm'
                >
                  {category.name}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      name === category.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default CategoryFilter