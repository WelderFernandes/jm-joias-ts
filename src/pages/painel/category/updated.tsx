import { Box, FormHelperText, Grid } from '@mui/material'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { ChangeEvent, useContext, useState } from 'react'
import SaveIcon from '@mui/icons-material/Save'
import { LoadingButton } from '@mui/lab'
import { useForm } from 'react-hook-form'

import { CategoryContext } from '../../../contexts/CategoryContext'

type Category = {
  id: number
  name: string
  slug: string
  status: string
}

type CategoryUpdatedProps = {
  category: Category
}

function UpdatedCategory({ category }: CategoryUpdatedProps) {
  const { updatedCategories, handleAlert } = useContext(CategoryContext)
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm()

  const initialValues = {
    id: category.id,
    name: category.name,
    slug: category.slug,
    status: category.status == 'Ativo' ? '1' : '0'
  }

  const [values, setValues] = useState<Category>(initialValues)

  const handleChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target
    setStatus(name === 'status' ? value : status)

    setValues({ ...values, [name]: value })
  }

  async function handleStore(data: Category) {
    setLoading(true)

    if (data.name === '' || data.slug === '' || data.status === null) {
      setLoading(false)
      return
    }

    await updatedCategories({
      id: data.id,
      name: data.name,
      slug: data.slug,
      status: data.status
    })
    handleAlert({
      message: 'Categoria atualizado com sucesso!',
      variant: 'success'
    })
    reset()
    setLoading(false)
  }
  return (
    <Box mt={12}>
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 0, width: '25ch' },
          mt: '2rem',
          alignItems: 'center'
        }}
        onSubmit={handleSubmit(handleStore)}
        autoComplete="off"
      >
        <Grid
          container
          direction="column"
          alignItems="center"
          spacing={1}
          mb={4}
        >
          <input
            {...register('id', { required: 'Nome é Obrigatório.' })}
            type="hidden"
            name="id"
            value={category.id}
          />

          <Grid item>
            <TextField
              {...register('name', { required: 'Nome é Obrigatório.' })}
              id="name"
              name="name"
              focused
              label="Nome"
              defaultValue={category.name}
              variant="outlined"
              type={'text'}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                handleChange(event)
              }}
            />
            <FormHelperText error>{errors.name?.message}</FormHelperText>
          </Grid>
          <Grid item>
            <TextField
              {...register('slug', { required: 'Slug é Obrigatório.' })}
              id="outlined-basic"
              label="Slug"
              focused
              defaultValue={category.slug}
              variant="outlined"
              name="slug"
              type={'text'}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                handleChange(event)
              }}
            />
            <FormHelperText error>{errors.slug?.message}</FormHelperText>
          </Grid>
          <Grid item mt={0}>
            <FormControl>
              <InputLabel id="status">Status</InputLabel>
              <Select
                {...register('status', { required: 'Status é Obrigatório.' })}
                labelId="status"
                id="status"
                onChange={handleChange}
                name="status"
                value={values.status}
                label="Status"
                sx={{
                  width: '14rem'
                }}
              >
                <MenuItem disabled>
                  <em>Status</em>
                </MenuItem>
                <MenuItem value={1} divider>
                  Ativo
                </MenuItem>
                <MenuItem value={0}>Inativo</MenuItem>
              </Select>
              <FormHelperText error>{errors.status?.message}</FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
        <Box
          sx={{
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <LoadingButton
            type="submit"
            endIcon={<SaveIcon />}
            loading={loading}
            loadingPosition="end"
            variant="contained"
            color="success"
            size="large"
          >
            Salvar
          </LoadingButton>
        </Box>
      </Box>
    </Box>
  )
}

export default UpdatedCategory
