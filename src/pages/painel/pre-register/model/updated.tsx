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
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { ModelContext } from '../../../../contexts/ModelContext'
import { pt } from 'yup-locale-pt'

yup.setLocale(pt)
interface Model {
  id?: number
  name?: string
  status?: string
}

type ModelUpdatedProps = {
  model: Model
}

const schema = yup
  .object()
  .shape({
    name: yup.string().required(),
    status: yup.number().required()
  })
  .required()

function UpdatedModel({ model }: ModelUpdatedProps) {
  const { updatedModel, handleAlert } = useContext(ModelContext)
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<Model>({
    resolver: yupResolver(schema) // yup, joi and even your own.
  })

  const initialValues = {
    name: model?.name,
    status: model?.status == 'Ativo' ? '1' : '0'
  }

  const [values, setValues] = useState<Model>(initialValues)

  const handleChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target
    setStatus(name === 'status' ? value : status)

    setValues({ ...values, [name]: value })
  }

  async function handleUpdate(data: Model) {
    setLoading(true)

    if (data.name === '' || data.status === null) {
      setLoading(false)
      return
    }

    await updatedModel({
      id: data.id,
      name: data?.name as string,
      status: data?.status
    })
    handleAlert({
      message: 'Modelo atualizado com sucesso!',
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
        onSubmit={handleSubmit(data => handleUpdate(data))}
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
            {...register('id', { required: 'Nome ?? Obrigat??rio.' })}
            type="hidden"
            name="id"
            value={model?.id}
          />

          <Grid item>
            <TextField
              {...register('name', { required: 'Nome ?? Obrigat??rio.' })}
              id="name"
              name="name"
              focused
              label="Nome"
              defaultValue={model?.name}
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
                {...register('status', { required: 'Status ?? Obrigat??rio.' })}
                labelId="status"
                id="status"
                onChange={handleChange}
                name="status"
                value={values?.status}
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

export default UpdatedModel
