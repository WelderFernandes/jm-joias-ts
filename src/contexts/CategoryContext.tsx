import { createContext, useEffect, useState, ReactNode } from 'react'
import { api } from '../services/api'
import { VariantType, useSnackbar } from 'notistack'

interface CustomAlertProps {
  message: string
  variant?: VariantType
}

interface Category {
  id: number
  name: string
  slug: string
  status: string
  updated_at: string
  created_at: string
}

type CategoryInput = Omit<Category, 'id' | 'updated_at' | 'created_at'>

interface CategoryProviderProps {
  children: ReactNode
}

interface CategoryContextProps {
  categories: Category[]
  createCategories: (category: CategoryInput) => Promise<void>
  handleAlert: (data: CustomAlertProps) => void
}

export const CategoryContext = createContext<CategoryContextProps>(
  {} as CategoryContextProps
)

export function CategoryProvider({ children }: CategoryProviderProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    api.get('/api/category').then(response => {
      // setCategories(response.data.data)
      const newCategory: Array<Category> = []
      const data: Array<Category> = response.data.data
      data.map(category => {
        newCategory.push({
          id: category.id,
          name: category.name,
          slug: category.slug,
          status: category.status === 1 ? 'Ativo' : 'Inativo',
          updated_at: new Intl.DateTimeFormat('pt-BR').format(
            new Date(category.updated_at)
          ),
          created_at: new Intl.DateTimeFormat('pt-BR').format(
            new Date(category.updated_at)
          )
        })
      })
      setCategories(newCategory)
    })
  }, [])

  async function createCategories(categoryInput: CategoryInput) {
    const response = await api.post('/api/category/store', categoryInput)

    const { data: category } = response.data

    setCategories([...categories, category])
  }

  async function deleteCaterory(id: number) {
    await api.delete(`/api/category/${id}`)

    const newCategories = categories.filter(category => category.id !== id)

    setCategories(newCategories)
  }

  async function deleteMultipleCategories(ids: number[]) {
    await api.delete(`/api/category/multiple/${ids}`)

    const newCategories = categories.filter(
      category => !ids.includes(category.id)
    )

    setCategories(newCategories)
  }

  // async function updateCategory(id: number, categoryInput: CategoryInput) {
  //   const response = await api.put(`/api/category/${id}`, categoryInput)

  // }

  function handleAlert({ message, variant }: CustomAlertProps) {
    enqueueSnackbar(message, { variant })
  }

  return (
    <CategoryContext.Provider
      value={{ categories, createCategories, handleAlert }}
    >
      {children}
    </CategoryContext.Provider>
  )
}
