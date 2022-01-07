import { useEffect, useContext, useState } from 'react'
import {
  DataGrid,
  GridSelectionModel,
  GridActionsCellItem,
  GridRowParams
} from '@mui/x-data-grid'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'

import { Layout } from '../../../components/Layout'
import { Button, Stack, Typography } from '@mui/material'
import { CategoryContext } from '../../../contexts/CategoryContext'
import { api } from '../../../services/api'
import Drawing from '../../../components/Drawing'
import StoreCategory from './store'
import UpdatedCategory from './updated'
import { Box } from '@mui/material/node_modules/@mui/system'
import Container from '@mui/material/Container'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'
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
    //bug
    setRows(categories)
  }, [categories])

  function handleEditCategory(params: GridRowParams) {
    if (params) {
      setDrawingContent(params.row as Category)
      setDrawingTitle('Editar Categoria')
      setopenDrawingUpdated(true)
    }
  }

  async function handleSingleDeleteCategory(params: GridRowParams) {
    console.log(params.row.id)
    await api
      .post(`api/category/massdelete/${params.row.id}`)
      .then(() => {
        setRows(categories.filter(category => category.id !== params.row.id))
      })
      .catch(err => {
        console.log(err)
      })
  }

  const columns = [
    { field: 'id', headerName: 'ID', minWidth: 100 },
    { field: 'name', headerName: 'Nome', minWidth: 250 },
    { field: 'status', headerName: 'Status', minWidth: 150 },
    { field: 'created_at', headerName: 'Data de Criaçao', minWidth: 220 },
    { field: 'updated_at', headerName: 'Data de Atualização', minWidth: 220 },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Ações',
      width: 100,
      cellClassName: 'actions',
      getActions: (params: GridRowParams) => {
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={() => handleEditCategory(params)}
            color="primary"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            className="textPrimary"
            onClick={() => {
              handleSingleDeleteCategory(params)
            }}
            sx={{ color: 'red' }}
          />
        ]
      }
    }
  ]
  function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    event.preventDefault()
    console.info('You clicked a breadcrumb.')
  }
  return (
    <Layout>
      <Container maxWidth="md">
        <Stack
          direction="row"
          spacing={2}
          mb={1}
          sx={{
            justifyContent: 'space-between'
          }}
        >
          <Typography variant="h5" component="h5">
            Categorias
          </Typography>

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
            startIcon={<AddIcon />}
            onClick={() => {
              setOpenDrawingCreated(true)
            }}
          >
            Cadastrar
          </Button>
        </Stack>
        <Stack spacing={2} mb={5}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link underline="hover" color="inherit" href="/painel">
              Painel
            </Link>

            <Link
              underline="hover"
              color="text.primary"
              href="/painel/category/"
              aria-current="page"
            >
              Categorias
            </Link>
          </Breadcrumbs>
        </Stack>
      </Container>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '20px',
          flexDirection: 'column',
          height: '70vh'
        }}
      >
        <Box
          component="div"
          sx={{
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignContent: 'center',
            justifyItems: 'center',
            p: 1,
            m: 1,
            height: '100%',
            width: '70%'
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            disableSelectionOnClick={true}
            checkboxSelection
            onSelectionModelChange={ids => {
              setSelected(ids)
              setSelectionModel(ids as any)
            }}
            sx={{
              border: '1px solid #e0e0e0',
              backgroundColor: '#fafafa',
              height: '100%',
              borderRadius: 4,
              boxShadow: '0px 0px 1px rgba(0,0,0,0.1)',
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
        </Box>
      </Box>
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
