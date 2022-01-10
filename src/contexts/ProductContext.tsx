import { createContext, useEffect, useState, ReactNode } from 'react'
import { api } from '../services/api'
import { VariantType, useSnackbar } from 'notistack'

interface CustomAlertProps {
  message: string
  variant?: VariantType
}

interface Product {
  id?: number
  name: string
  slug: string
  status: any
  updated_at: string
  created_at: string
}

type ProductInput = Omit<Product, 'updated_at' | 'created_at'>

interface ProductProviderProps {
  children: ReactNode
}

interface ProductContextProps {
  categories: Product[]
  createCategories: (product: ProductInput) => Promise<void>
  updatedCategories: (product: ProductInput) => Promise<void>
  handleAlert: (data: CustomAlertProps) => void
}

export const ProductContext = createContext<ProductContextProps>(
  {} as ProductContextProps
)

export function ProductProvider({ children }: ProductProviderProps) {
  const [categories, setCategories] = useState<Product[]>([])
  const { enqueueSnackbar } = useSnackbar()
  const [update, setUpdate] = useState(false)

  useEffect(() => {
    api.get('/api/product').then(response => {
      // setCategories(response.data.data)
      const newProduct: Array<Product> = []
      const data: Array<any> = response.data.data
      data.map(product => {
        newProduct.push({
          id: product.id,
          name: product.name,
          slug: product.slug,
          status: product.status == 1 ? 'Ativo' : 'Inativo',
          updated_at: new Intl.DateTimeFormat('pt-BR').format(
            new Date(product.updated_at)
          ),
          created_at: new Intl.DateTimeFormat('pt-BR').format(
            new Date(product.updated_at)
          )
        })
      })
      setCategories(newProduct)
    })
  }, [update])

  async function createCategories(productInput: ProductInput) {
    const response = await api.post('/api/product/store', productInput)

    const { data } = response.data

    const product = {
      id: data.id,
      name: data.name,
      slug: data.slug,
      status: data.status == 1 ? 'Ativo' : 'Inativo',
      updated_at: new Intl.DateTimeFormat('pt-BR').format(
        new Date(data.updated_at)
      ),
      created_at: new Intl.DateTimeFormat('pt-BR').format(
        new Date(data.updated_at)
      )
    }

    setCategories([...categories, product])
  }

  async function updatedCategories(productInput: ProductInput) {
    const response = await api.put(`/api/product/${productInput.id}`, {
      name: productInput.name,
      slug: productInput.slug,
      status: productInput.status === 'Ativo' ? 1 : 0
    })

    const { data } = response.data
    setCategories([...categories, data])
    setUpdate(!update)
  }

  function handleAlert({ message, variant }: CustomAlertProps) {
    enqueueSnackbar(message, { variant })
  }

  return (
    <ProductContext.Provider
      value={{ categories, createCategories, updatedCategories, handleAlert }}
    >
      {children}
    </ProductContext.Provider>
  )
}
