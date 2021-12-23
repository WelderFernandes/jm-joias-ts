import { Box, Container, Grid, InputAdornment } from '@mui/material'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { ChangeEvent, ChangeEventHandler, FormEvent, useState } from 'react'
import SaveIcon from '@mui/icons-material/Save'
import { LoadingButton } from '@mui/lab'

type CategoryStoreProps = {
  name: string
  description: string
  slug: string
  status: number
}

const initialValues: CategoryStoreProps = {
  name: '',
  slug: '',
  description: '',
  status: 0
}

function StoreCategory() {
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const [values, setValues] = useState({})
  console.log(values)

  const handleChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target
    setStatus(name === 'status' ? value : status)

    setValues({ ...values, [name]: value })
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
      noValidate
      autoComplete="off"
    >
      <Grid container direction="column" alignItems="center" spacing={1} mb={4}>
        <Grid item>
          <TextField
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
          onClick={handleClick}
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
