import { createContext, useEffect, useState, ReactNode } from 'react'
import { api } from '../services/api'
import { VariantType, useSnackbar } from 'notistack'
import { parseCookies } from 'nookies'

interface CustomAlertProps {
  message: string
  variant?: VariantType
}

interface Category {
  id?: number
  name: string
  status: any
  updated_at: string
  created_at: string
}

type CategoryInput = Omit<Category, 'updated_at' | 'created_at'>

interface CategoryProviderProps {
  children: ReactNode
}

interface CategoryContextProps {
  categories: Category[]
  createCategories: (category: CategoryInput) => Promise<void>
  updatedCategories: (category: CategoryInput) => Promise<void>
  deleteCategories: (id: number) => Promise<void>
  massDeleteCategories: (ids: number[]) => Promise<void>
  handleAlert: (data: CustomAlertProps) => void
}

export const CategoryContext = createContext<CategoryContextProps>(
  {} as CategoryContextProps
)

export function CategoryProvider({ children }: CategoryProviderProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const { enqueueSnackbar } = useSnackbar()
  const [update, setUpdate] = useState(false)
  const { 'memeli.token': token } = parseCookies()

  useEffect(() => {
    if (token) {
      api
        .get('/api/category')
        .then(response => {
          const newCategory: Array<Category> = []
          const data: Array<any> = response.data.data
          data.map(category => {
            newCategory.push({
              id: category.id,
              name: category.name,
              status: category.status == 1 ? 'Ativo' : 'Inativo',
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
        .catch(error => {
          enqueueSnackbar('Erro ao carregar as categorias', {
            variant: 'error'
          })
        })
    }
  }, [token, update])

  async function createCategories(categoryInput: CategoryInput) {
    const response = await api.post('/api/category/store', {
      name: categoryInput.name,
      status: categoryInput.status == 1 ? '1' : '0'
    })

    const { data } = response.data

    const category = {
      id: data.id,
      name: data.name,
      status: data.status == 1 ? 'Ativo' : 'Inativo',
      updated_at: new Intl.DateTimeFormat('pt-BR').format(
        new Date(data.updated_at)
      ),
      created_at: new Intl.DateTimeFormat('pt-BR').format(
        new Date(data.updated_at)
      )
    }

    setCategories([...categories, category])
  }

  async function updatedCategories(categoryInput: CategoryInput) {
    const response = await api.put(`/api/category/${categoryInput.id}`, {
      name: categoryInput.name,
      status: categoryInput.status === 1 ? '1' : '0'
    })

    const { data } = response.data
    setCategories([...categories, data])
    setUpdate(!update)
  }

  async function deleteCategories(id: number) {
    await api.post(`/api/category/massdelete/${id}`).then(() => {
      setCategories(categories.filter(category => category.id !== id))
    })
  }

  async function massDeleteCategories(id: number[]) {
    await api.post(`/api/category/massdelete/${id}`).then(() => {
      id.map(id => {
        setCategories(categories.filter(cat => !categories.includes(cat)))
      })
    })
  }

  function handleAlert({ message, variant }: CustomAlertProps) {
    enqueueSnackbar(message, { variant })
  }

  return (
    <CategoryContext.Provider
      value={{
        categories,
        createCategories,
        updatedCategories,
        deleteCategories,
        massDeleteCategories,
        handleAlert
      }}
    >
      {children}
    </CategoryContext.Provider>
  )
}
