import { createContext, useEffect, useState, ReactNode } from 'react'
import { api } from '../services/api'
import { VariantType, useSnackbar } from 'notistack'
import { parseCookies } from 'nookies'

interface CustomAlertProps {
  message: string
  variant?: VariantType
}

interface Model {
  id?: number
  name: string
  status: any
  updated_at: string
  created_at: string
}

type ModelInput = Omit<Model, 'updated_at' | 'created_at'>

interface ModelProviderProps {
  children: ReactNode
}

interface ModelContextProps {
  model: Model[]
  createModel: (model: ModelInput) => Promise<void>
  updatedModel: (model: ModelInput) => Promise<void>
  deleteModel: (id: number) => Promise<void>
  massDeleteModels: (ids: number[]) => Promise<void>
  handleAlert: (data: CustomAlertProps) => void
}

export const ModelContext = createContext<ModelContextProps>(
  {} as ModelContextProps
)

export function ModelProvider({ children }: ModelProviderProps) {
  const [model, setModel] = useState<Model[]>([])
  const { enqueueSnackbar } = useSnackbar()
  const [update, setUpdate] = useState(false)
  const { 'memeli.token': token } = parseCookies()

  useEffect(() => {
    if (token) {
      api
        .get('/api/model')
        .then(response => {
          const newModel: Array<Model> = []
          const data: Array<any> = response.data.data
          data.map(model => {
            newModel.push({
              id: model.id,
              name: model.name,
              status: model.status == 1 ? 'Ativo' : 'Inativo',
              updated_at: new Intl.DateTimeFormat('pt-BR').format(
                new Date(model.updated_at)
              ),
              created_at: new Intl.DateTimeFormat('pt-BR').format(
                new Date(model.updated_at)
              )
            })
          })
          console.log('newModel', newModel)
          setModel(newModel)
        })
        .catch(error => {
          enqueueSnackbar('Erro ao carregar as categorias', {
            variant: 'error'
          })
        })
    }
  }, [token, update])

  async function createModel(modelInput: ModelInput) {
    const response = await api.post('/api/model/store', {
      name: modelInput.name,
      status: modelInput.status == 1 ? '1' : '0'
    })

    const { data } = response.data

    const newModel = {
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

    setModel([...model, newModel])
  }

  async function updatedModel(modelInput: ModelInput) {
    const response = await api.put(`/api/model/${modelInput.id}`, {
      name: modelInput.name,
      status: modelInput.status === 1 ? '1' : '0'
    })

    const { data } = response.data
    setModel([...model, data])
    setUpdate(!update)
  }

  async function deleteModel(id: number) {
    await api.post(`/api/model/massdelete/${id}`).then(() => {
      setModel(model.filter(model => model.id !== id))
    })
  }
  async function massDeleteModels(id: number[]) {
    await api.post(`/api/model/massdelete/${id}`).then(async () => {
      setUpdate(!update)
    })
  }

  function handleAlert({ message, variant }: CustomAlertProps) {
    enqueueSnackbar(message, { variant })
  }

  return (
    <ModelContext.Provider
      value={{
        model,
        createModel,
        updatedModel,
        deleteModel,
        massDeleteModels,
        handleAlert
      }}
    >
      {children}
    </ModelContext.Provider>
  )
}
