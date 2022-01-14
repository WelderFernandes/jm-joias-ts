import { Box, FormHelperText, Grid, useFormControl } from '@mui/material'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { ChangeEvent, useContext, useState } from 'react'
import SaveIcon from '@mui/icons-material/Save'
import { LoadingButton } from '@mui/lab'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { CategoryContext } from '../../../contexts/CategoryContext'

type CategoryStoreProps = {
  name: string
  status: number
  message?: string
}

const schema = yup
  .object()
  .shape({
    name: yup.string().required(),
    status: yup.number().required()
  })
  .required()

function StoreCategory() {
  const { createCategories, handleAlert } = useContext(CategoryContext)
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CategoryStoreProps>({
    resolver: yupResolver(schema) // yup, joi and even your own.
  })

  const [values, setValues] = useState({})

  const handleChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target
    setStatus(name === 'status' ? value : status)

    setValues({ ...values, [name]: value })
  }
  async function handleStore(data: CategoryStoreProps) {
    setLoading(true)
    if (data.name === '' || data.status === null) {
      setLoading(false)
      return
    }

    await createCategories({
      name: data.name,
      status: data.status
    })

    handleAlert({
      message: 'Categoria cadastrada com sucesso!',
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
        onSubmit={handleSubmit(data => handleStore(data))}
        autoComplete="off"
      >
        <Grid
          container
          direction="column"
          alignItems="center"
          spacing={1}
          mb={4}
        >
          <Grid item>
            <TextField
              {...register('name', { required: 'Nome é Obrigatório.' })}
              id="name"
              name="name"
              label="Nome"
              variant="outlined"
              type={'text'}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                handleChange(event)
              }}
            />
            <FormHelperText error>{errors.name?.message}</FormHelperText>
          </Grid>

          <Grid item mt={0}>
            <FormControl>
              <InputLabel id="status">Status</InputLabel>
              <Select
                {...register('status', { required: 'Status é Obrigatório.' })}
                labelId="status"
                id="status"
                onChange={handleChange}
                value={status}
                name="status"
                label="Status"
                sx={{
                  width: '14rem'
                }}
              >
                <MenuItem disabled value="">
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

export default StoreCategory
