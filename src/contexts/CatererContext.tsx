import { createContext, useEffect, useState, ReactNode } from 'react'
import { api } from '../services/api'
import { VariantType, useSnackbar } from 'notistack'
import { parseCookies } from 'nookies'

interface CustomAlertProps {
  message: string
  variant?: VariantType
}

interface Caterer {
  id?: number
  name: string
  cnpj: string
  telephone: string
  whatsapp: string
  status: string
  street: string
  number: string
  zip_code: string
  district: string
  city: string
  state: string
  updated_at: string
  created_at: string
}

type CatererInput = Omit<Caterer, 'updated_at' | 'created_at'>

interface CatererCatererProps {
  children: ReactNode
}

interface CatererContextProps {
  caterer: Caterer[]
  created: (model: CatererInput) => Promise<void>
  updated: (model: CatererInput) => Promise<void>
  deleted: (id: number) => Promise<void>
  massDeleted: (ids: number[]) => Promise<void>
  handleAlert: (data: CustomAlertProps) => void
}

export const CatererContext = createContext<CatererContextProps>(
  {} as CatererContextProps
)

export function CatererProvider({ children }: CatererCatererProps) {
  const [caterer, setCaterer] = useState<Caterer[]>([])
  const { enqueueSnackbar } = useSnackbar()
  const [update, setUpdate] = useState(false)
  const { 'memeli.token': token } = parseCookies()

  useEffect(() => {
    if (token) {
      api
        .get('/api/provider')
        .then(response => {
          const newCaterer: Array<Caterer> = []
          const data: Array<any> = response.data.data
          data.map(caterer => {
            newCaterer.push({
              id: caterer.id,
              name: caterer.name,
              status: caterer.status == 1 ? 'Ativo' : 'Inativo',
              updated_at: new Intl.DateTimeFormat('pt-BR').format(
                new Date(caterer.updated_at)
              ),
              created_at: new Intl.DateTimeFormat('pt-BR').format(
                new Date(caterer.updated_at)
              ),
              cnpj: caterer.cnpj,
              telephone: caterer.telephone,
              whatsapp: caterer.whatsapp,
              street: caterer.street,
              number: caterer.number,
              zip_code: caterer.zip_code,
              district: caterer.district,
              city: caterer.city,
              state: caterer.state
            })
          })
          console.log('newCaterer', newCaterer)
          setCaterer(newCaterer)
        })
        .catch(error => {
          enqueueSnackbar('Erro ao carregar os fornecedores', {
            variant: 'error'
          })
        })
    }
  }, [token, update])

  async function created(CatererInput: CatererInput) {
    const response = await api.post('/api/model/store', {
      name: CatererInput.name,
      status: CatererInput.status,
      cnpj: CatererInput.cnpj,
      telephone: CatererInput.telephone,
      whatsapp: CatererInput.whatsapp,
      street: CatererInput.street,
      number: CatererInput.number,
      zip_code: CatererInput.zip_code,
      district: CatererInput.district,
      city: CatererInput.city,
      state: CatererInput.state
    })

    const { data } = response.data

    const newCaterer = {
      id: data.id,
      name: data.name,
      status: data.status == 1 ? 'Ativo' : 'Inativo',
      updated_at: new Intl.DateTimeFormat('pt-BR').format(
        new Date(data.updated_at)
      ),
      created_at: new Intl.DateTimeFormat('pt-BR').format(
        new Date(data.updated_at)
      ),
      cnpj: data.cnpj,
      telephone: data.telephone,
      whatsapp: data.whatsapp,
      street: data.street,
      number: data.number,
      zip_code: data.zip_code,
      district: data.district,
      city: data.city,
      state: data.state
    }

    setCaterer([...caterer, newCaterer])
  }

  async function updated(CatererInput: CatererInput) {
    const response = await api.put(`/api/caterer/${CatererInput.id}`, {
      name: CatererInput.name,
      status: CatererInput.status === '1' ? '1' : '0',
      cnpj: CatererInput.cnpj,
      telephone: CatererInput.telephone,
      whatsapp: CatererInput.whatsapp,
      street: CatererInput.street,
      number: CatererInput.number,
      zip_code: CatererInput.zip_code,
      district: CatererInput.district,
      city: CatererInput.city,
      state: CatererInput.state
    })

    const { data } = response.data
    setCaterer([...caterer, data])
    setUpdate(!update)
  }

  async function deleted(id: number) {
    await api.post(`/api/caterer/massdelete/${id}`).then(() => {
      setCaterer(caterer.filter(caterer => caterer.id !== id))
    })
  }
  async function massDeleted(id: number[]) {
    await api.post(`/api/caterer/massdelete/${id}`).then(async () => {
      setUpdate(!update)
    })
  }

  function handleAlert({ message, variant }: CustomAlertProps) {
    enqueueSnackbar(message, { variant })
  }

  return (
    <CatererContext.Provider
      value={{
        caterer,
        created,
        updated,
        deleted,
        massDeleted,
        handleAlert
      }}
    >
      {children}
    </CatererContext.Provider>
  )
}
