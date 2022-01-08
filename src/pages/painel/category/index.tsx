import {
  useEffect,
  useContext,
  useState,
  forwardRef,
  InputHTMLAttributes
} from 'react'
import {
  DataGrid,
  GridSelectionModel,
  GridActionsCellItem,
  GridRowParams,
  nlNL
} from '@mui/x-data-grid'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'
import { styled, alpha } from '@mui/material/styles'
import { Layout } from '../../../components/Layout'
import { Button, Stack, Typography } from '@mui/material'
import { CategoryContext } from '../../../contexts/CategoryContext'
import { api } from '../../../services/api'
import Drawing from '../../../components/Drawing'
import StoreCategory from './store'
import UpdatedCategory from './updated'
import { Box } from '@mui/material/node_modules/@mui/system'

import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { ptBR } from '@mui/material/locale'
import InputBase from '@mui/material/InputBase'
import SearchIcon from '@mui/icons-material/Search'
interface Category {
  id: number
  name: string
  slug: string
  status: string
  updated_at: string
  created_at: string
}

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.grey[400]}`,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25)
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto'
  }
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch'
      }
    }
  }
}))
const theme = createTheme(
  {
    palette: {
      primary: { main: '#1976d2' }
    }
  },
  ptBR
)
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

  function handleSearch(value: string) {
    setRows(
      categories.filter(category =>
        category.name.toLocaleLowerCase().includes(value)
      )
    )
  }

  return (
    <Layout>
      <Box maxWidth="md" sx={{ marginLeft: '5%' }}>
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
      </Box>
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
            alignItems: 'left',
            display: 'flex',
            flexDirection: 'column',
            alignContent: 'center',
            justifyItems: 'center',
            p: 1,
            m: 1,
            height: '100%',
            width: '100%',
            border: '1px solid #e0e0e0',
            backgroundColor: '#fafafa',
            borderRadius: 4,

            [theme.breakpoints.up('lg')]: {
              width: '70%'
            },
            // boxShadow: '0px 0px 1px rgba(0,0,0,0.1)'
            boxShadow:
              '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)'
          }}
        >
          <Box mt={2} sx={{ width: '100%' }}>
            <Stack
              mb={2}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}
            >
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search…"
                  inputProps={{ 'aria-label': 'search' }}
                  onChange={e => handleSearch(e.target.value)}
                />
              </Search>
              {selected.length > 0 && (
                <Button
                  size="small"
                  variant="outlined"
                  sx={{
                    color: 'red',
                    borderColor: 'red',
                    width: '100px'
                  }}
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
                sx={{ width: '120px', marginLeft: '10px' }}
              >
                Cadastrar
              </Button>
            </Stack>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'left',
              flexDirection: 'row',
              width: '100%'
            }}
          ></Box>
          <ThemeProvider theme={theme}>
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
                width: '100%'
              }}
            />
          </ThemeProvider>
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
