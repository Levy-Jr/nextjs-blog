import { create } from 'zustand'

type useCategoryFilter = {
  category: string;
}

type Action = {
  updateCategory: (category: useCategoryFilter['category']) => void;
}

export const useCategoryFilter = create<useCategoryFilter & Action>((set) => ({
  category: '',
  updateCategory: (category) => set(() => ({ category: category }))
}))