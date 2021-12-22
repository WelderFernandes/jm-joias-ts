import { Box, Container, Grid, InputAdornment } from '@mui/material'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { useState } from 'react'
import SaveIcon from '@mui/icons-material/Save'
import { LoadingButton } from '@mui/lab'

function StoreCategory() {
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  function handleClick() {
    setLoading(true)
  }

  const handleChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value)
  }
  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
        flexGrow: 1,
        mt: '2rem'
      }}
      noValidate
      autoComplete="off"
    >
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        mb={3}
      >
        <Grid item>
          <TextField
            id="outlined-basic"
            label="Nome"
            variant="outlined"
            type={'text'}
          />
        </Grid>
        <Grid item>
          <TextField
            id="outlined-basic"
            label="Slug"
            variant="outlined"
            type={'text'}
          />
        </Grid>
        <Grid item mt={0}>
          <FormControl>
            <InputLabel id="demo-simple-select-autowidth-label">
              Status
            </InputLabel>
            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              value={status}
              onChange={handleChange}
              autoWidth
              label="Status"
              sx={{
                width: '22ch'
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
