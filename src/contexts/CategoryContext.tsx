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
  status: number
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
      setCategories(response.data.data)
    })
  }, [])

  async function createCategories(categoryInput: CategoryInput) {
    const response = await api.post('/api/category/store', categoryInput)

    const { data: category } = response.data

    setCategories([...categories, category])
  }

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
