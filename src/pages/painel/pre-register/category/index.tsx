import { useEffect, useContext, useState } from 'react'
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
import { Button, Stack, Typography } from '@mui/material'
import StoreCategory from './store'
import UpdatedCategory from './updated'
import Box from '@mui/material/Box'

import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { ptBR } from '@mui/material/locale'
import InputBase from '@mui/material/InputBase'
import SearchIcon from '@mui/icons-material/Search'
import { GetServerSideProps } from 'next'
import { parseCookies } from 'nookies'

import ResponsiveDialog from '../../../../components/Dialog'
import { Layout } from '../../../../components/Layout'
import { CategoryContext } from '../../../../contexts/CategoryContext'
import Drawing from '../../../../components/Drawing'
import { api } from '../../../../services/api'
import { localeDatagrid } from '../../../../utils/localeDatagrid'

interface Category {
  id: number
  name: string
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
  const { categories, deleteCategories, massDeleteCategories, handleAlert } =
    useContext(CategoryContext)
  const [selecteds, setSelecteds] = useState<GridSelectionModel>([])
  const [selectionModel, setSelectionModel] = useState([])
  const [openDrawingCreated, setOpenDrawingCreated] = useState(false)
  const [openDrawingUpdated, setopenDrawingUpdated] = useState(false)
  const [drawingTitle, setDrawingTitle] = useState('')
  const [drawingContent, setDrawingContent] = useState<Category>({} as Category)
  const [openPopup, setOpenPopup] = useState(false)
  const [category, setCategory] = useState<Category>({} as Category)
  const [rows, setRows] = useState(categories)
  const [message, setMessage] = useState('')

  useEffect(() => {
    setRows(categories)
  }, [categories])

  const columns = [
    { field: 'id', headerName: 'ID', minWidth: 100 },
    { field: 'name', headerName: 'Nome', minWidth: 250 },
    { field: 'status', headerName: 'Status', minWidth: 150 },
    { field: 'created_at', headerName: 'Data de Cria??ao', minWidth: 220 },
    { field: 'updated_at', headerName: 'Data de Atualiza????o', minWidth: 220 },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'A????es',
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
              handlePopUp(params)
            }}
            sx={{ color: 'red' }}
          />
        ]
      }
    }
  ]

  function handleEditCategory(params: GridRowParams) {
    if (params) {
      setDrawingContent(params.row as Category)
      setDrawingTitle('Editar Categoria')
      setopenDrawingUpdated(true)
    }
  }

  function handlePopUp(params?: GridRowParams, id?: GridSelectionModel) {
    if (params) {
      setMessage('Ser?? exclu??da a categoria')
      setOpenPopup(true)
      setCategory(params.row as Category)
    }
    if (id) {
      setMessage('Deseja realmente excluir as categorias Selecionadas?')
      setOpenPopup(true)
    }
  }

  async function handleDeleteCategory(category: Category) {
    await deleteCategories(category.id)
    setRows(categories.filter(categories => categories.id !== category.id))
    setOpenPopup(false)
    handleAlert({
      message: 'Deletado com SUCESSO!',
      variant: 'success'
    })
  }

  async function handleDeleteCategoriesSelected() {
    await massDeleteCategories(selecteds as number[])
    const selectedIDs = new Set<any>(selecteds)
    const ids: number[] = []

    selectedIDs.forEach(id => {
      ids.push(id)
    })

    setRows(categories.filter(categories => !selectedIDs.has(categories.id)))
    setOpenPopup(false)
    handleAlert({
      message: 'Deletado com SUCESSO!',
      variant: 'success'
    })
  }

  function handleSearch(value: string) {
    setRows(
      categories.filter(category =>
        category.name.toLocaleLowerCase().includes(value.toLocaleLowerCase())
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
            <Link underline="hover" color="inherit" href="/#">
              pr??-cadastros
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

            [theme.breakpoints.up('xl')]: {
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
                justifyContent: 'flex-end'
              }}
            >
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search???"
                  inputProps={{ 'aria-label': 'search' }}
                  onChange={e => handleSearch(e.target.value)}
                />
              </Search>
              {selecteds.length > 0 && (
                <Button
                  size="small"
                  variant="outlined"
                  sx={{
                    color: 'red',
                    borderColor: 'red',
                    width: '100px',
                    marginLeft: '10px'
                  }}
                  startIcon={<DeleteIcon />}
                  onClick={() => {
                    handlePopUp(undefined, selecteds)
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
              onSelectionModelChange={(selected: GridSelectionModel) => {
                setSelecteds(selected)
              }}
              sx={{
                height: '100vh'
              }}
              localeText={localeDatagrid}
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
      {openPopup && (
        <ResponsiveDialog
          closeModal={() => {
            setOpenPopup(false)
            setCategory({} as Category)
          }}
          confirm={() => {
            if (category.id) {
              handleDeleteCategory(category)
              setCategory({} as Category)
            } else {
              handleDeleteCategoriesSelected()
              setCategory({} as Category)
            }
          }}
          title="DELETAR"
          confirmText="Deletar"
          confirmColor="red"
        >
          <span>
            {message}
            <b>
              {' '}
              <u>{category?.name}</u>
            </b>
          </span>
        </ResponsiveDialog>
      )}
    </Layout>
  )
}
export const getServerSideProps: GetServerSideProps = async ctx => {
  // const apiClient = getApiClient(ctx)

  const { ['memeli.token']: token } = parseCookies(ctx)
  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }
  return {
    props: {}
  }
}
