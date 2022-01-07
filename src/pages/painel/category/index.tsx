import { useEffect, useContext, useState } from 'react'
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridSelectionModel,
  GridActionsCellItem
} from '@mui/x-data-grid'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'

import { Layout } from '../../../components/Layout'
import { Button, Stack, Typography } from '@mui/material'
import { CategoryContext } from '../../../contexts/CategoryContext'
import { api } from '../../../services/api'
import Drawing from '../../../components/Drawing'
import StoreCategory from './store'
import UpdatedCategory from './updated'

interface Category {
  id: number
  name: string
  slug: string
  status: string
  updated_at: string
  created_at: string
}

export default function ControlledSelectionGrid() {
  const { categories } = useContext(CategoryContext)
  const [selected, setSelected] = useState<GridSelectionModel>([])
  const [selectionModel, setSelectionModel] = useState([])
  const [openDrawingCreated, setOpenDrawingCreated] = useState(false)
  const [openDrawingUpdated, setopenDrawingUpdated] = useState(false)
  const [drawingTitle, setDrawingTitle] = useState('')
  const [drawingContent, setDrawingContent] = useState<Category>({} as Category)

  const [rows, setRows] = useState(categories)

  useEffect(() => {
    setRows(categories)
  }, [categories])

  function handleEditCategory(id: number) {
    const category = categories.find(category => category.id === id)
    if (id) {
      setDrawingContent(category as Category)
      setDrawingTitle('Editar Categoria')
      setopenDrawingUpdated(true)
    }
  }

  async function handleSingleDeleteCategory(id: number) {
    await api.post(`api/category/massdelete/${id}`)
    await api.get('api/category').then(response => {
      setRows(response.data)
    })
    // setRows(r => r.filter(x => !selectedIDs.has(x.id)))
  }

  const columns = [
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'name', headerName: 'Nome', width: 250 },
    { field: 'status', headerName: 'Status', width: 250 },
    { field: 'created_at', headerName: 'Data de Criaçao', width: 200 },
    { field: 'updated_at', headerName: 'Data de Atualização', width: 200 },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Ações',
      width: 100,
      cellClassName: 'actions',
      getActions: (id: number) => {
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={() => handleEditCategory(id)}
            color="primary"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            className="textPrimary"
            onClick={() => {
              handleSingleDeleteCategory(id)
            }}
            sx={{ color: 'red' }}
          />
        ]
      }
    }
  ]

  return (
    <Layout>
      <div style={{ height: 400, width: '100%' }}>
        <Stack
          direction="row"
          spacing={2}
          mb={3}
          sx={{
            justifyContent: 'space-between'
          }}
        >
          {selected.length > 0 && (
            <Button
              size="small"
              variant="outlined"
              sx={{ color: 'red', borderColor: 'red' }}
              startIcon={<DeleteIcon />}
              onClick={async () => {
                const selectedIDs = new Set<any>(selectionModel)

                const ids: number[] = []

                selectedIDs.forEach(id => {
                  ids.push(id)
                })

                await api.post(`api/category/massdelete/${ids}`)
                setRows(r => r.filter(x => !selectedIDs.has(x.id)))
              }}
            >
              DELETAR
            </Button>
          )}
          <Button
            variant="contained"
            size="small"
            color="success"
            startIcon={<SaveIcon />}
            onClick={() => {
              setOpenDrawingCreated(true)
            }}
          >
            Cadastrar
          </Button>
        </Stack>
        <DataGrid
          rows={rows}
          columns={columns}
          checkboxSelection
          onSelectionModelChange={ids => {
            setSelected(ids)
            setSelectionModel(ids as any)
          }}
          sx={{
            backgroundColor: 'white',
            borderRadius: 4,
            boxShadow: '0px 0px 1px rgba(0,0,0,0.1)',
            height: '100%',
            width: '100%'
          }}
          localeText={{
            // Root
            noRowsLabel: 'Nenhum registro encontrado',
            noResultsOverlayLabel: 'Nenhum registro encontrado',
            errorOverlayDefaultLabel: 'Erro ao carregar dados',

            columnMenuShowColumns: 'Mostrar colunas',
            columnMenuFilter: 'Filtrar',
            columnMenuHideColumn: 'Esconder coluna',
            columnMenuUnsort: 'Desordenar',
            columnMenuSortAsc: 'Ordenar crescente',
            // Filter panel text
            filterPanelAddFilter: 'Adicionar filtro',
            filterPanelDeleteIconLabel: 'Remover',
            filterPanelOperators: ' Operadores ',
            filterPanelOperatorAnd: ' E ',
            filterPanelOperatorOr: ' OU ',
            filterPanelColumns: 'Colunas',
            filterPanelInputLabel: 'Valor',
            filterPanelInputPlaceholder: 'Digite aqui',

            // Filter operators text
            filterOperatorContains: 'Contém',
            filterOperatorEquals: 'Igual',
            filterOperatorStartsWith: 'Começa com',
            filterOperatorEndsWith: 'Termina com',
            filterOperatorIs: ' é ',
            filterOperatorNot: 'Não é',
            filterOperatorAfter: 'Depois',
            filterOperatorOnOrAfter: 'Em ou depois',
            filterOperatorBefore: 'Antes',
            filterOperatorOnOrBefore: 'Em ou antes',
            filterOperatorIsEmpty: 'Está vazio',
            filterOperatorIsNotEmpty: 'Não está vazio',

            footerTotalRows: 'Total de linhas',
            checkboxSelectionHeaderName: 'Selecionar todos',

            // Used core components translation keys
            MuiTablePagination: {
              labelRowsPerPage: 'Linhas por página'
            },

            footerRowSelected: count =>
              count !== 1
                ? `${count.toLocaleString()} Linhas selecionadas`
                : `${count.toLocaleString()} Linha selecionada`
          }}
        />
      </div>
      {openDrawingCreated && (
        <Drawing
          anchor="right"
          title="Cadastro de categoria"
          onClose={() => setOpenDrawingCreated(false)}
        >
          <StoreCategory />
        </Drawing>
      )}
      {openDrawingUpdated && (
        <Drawing
          anchor="right"
          title={drawingTitle}
          onClose={() => setopenDrawingUpdated(false)}
        >
          <UpdatedCategory category={drawingContent} />
        </Drawing>
      )}
    </Layout>
  )
}
