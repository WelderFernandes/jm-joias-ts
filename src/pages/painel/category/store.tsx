import { Box, Container, Grid, InputAdornment } from '@mui/material'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { ChangeEvent, useState } from 'react'
import SaveIcon from '@mui/icons-material/Save'
import { LoadingButton } from '@mui/lab'
import { useForm } from 'react-hook-form'
import { api } from '../../../services/api'
import Alert from '@mui/material/Alert'
import IconButton from '@mui/material/IconButton'
import Collapse from '@mui/material/Collapse'
import CloseIcon from '@mui/icons-material/Close'

type CategoryStoreProps = {
  name: string
  slug: string
  status: number
  message: string
}

function StoreCategory() {
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit } = useForm()
  const [open, setOpen] = useState(false)
  const [success, setSuccess] = useState(true)
  const [message, setMessage] = useState('')

  const [values, setValues] = useState({})

  const handleChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target
    setStatus(name === 'status' ? value : status)

    setValues({ ...values, [name]: value })
  }
  async function handleStore(data: CategoryStoreProps) {
    setLoading(true)
    if (data.name === '' || data.slug === '' || data.status === null) {
      setLoading(false)
      return
    }
    setLoading(true)
    await api
      .post('/api/category/store', data)
      .then(response => {
        setOpen(true)
        setLoading(false)
        setSuccess(true)
        setMessage(response.data.success)
      })
      .catch(error => {
        setOpen(true)
        setLoading(false)
        setSuccess(false)
      })
  }

  function handleClick() {
    setLoading(true)
  }

  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 0, width: '25ch' },
        mt: '2rem'
      }}
      onSubmit={handleSubmit(handleStore)}
      autoComplete="off"
    >
      <Collapse in={open}>
        <Alert
          severity={success ? 'success' : 'error'}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false)
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {message}
        </Alert>
      </Collapse>
      <Grid container direction="column" alignItems="center" spacing={1} mb={4}>
        <Grid item>
          <TextField
            {...register('name')}
            id="name"
            name="name"
            label="Nome"
            variant="outlined"
            type={'text'}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              handleChange(event)
            }}
          />
        </Grid>
        <Grid item>
          <TextField
            {...register('slug')}
            id="outlined-basic"
            label="Slug"
            variant="outlined"
            name="slug"
            type={'text'}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              handleChange(event)
            }}
          />
        </Grid>
        <Grid item mt={0}>
          <FormControl>
            <InputLabel id="status">Status</InputLabel>
            <Select
              {...register('status', { required: true })}
              labelId="status"
              id="status"
              value={status}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                handleChange(event)
              }}
              name="status"
              label="Status"
              sx={{
                width: '14rem'
              }}
            >
              <MenuItem value={1}>Ativo</MenuItem>
              <MenuItem value={0}>Inativo</MenuItem>
            </Select>
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
  )
}

export default StoreCategory
