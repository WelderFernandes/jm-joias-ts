import { Box, FormHelperText, Grid, useFormControl } from '@mui/material'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { ChangeEvent, useContext, useEffect, useState } from 'react'
import SaveIcon from '@mui/icons-material/Save'
import { LoadingButton } from '@mui/lab'
import Container from '@mui/material/Container'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { CategoryContext } from '../../../../contexts/CategoryContext'
import Input from '@mui/material/Input'

import { pt } from 'yup-locale-pt'
import cep from 'cep-promise'
import MaskInput from '../../../../components/MaskInput'

yup.setLocale(pt)

type AdressStoreProps = {
  street: string
  number: string
  zipCode?: string
  district: string
  city: string
  state: string
  country: string
}

type CatererProps = {
  name: string
  status: number
  message?: string
  address?: AdressStoreProps
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
  const [zipCode, setZipCode] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [phone, setPhone] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CatererProps>({
    resolver: yupResolver(schema) // yup, joi and even your own.
  })

  const [values, setValues] = useState<CatererProps>({
    name: '',
    status: 0,
    message: '',
    address: {
      street: '',
      number: '',
      district: '',
      city: '',
      state: '',
      zipCode: ''
    } as AdressStoreProps
  })

  const handleChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target
    setStatus(name === 'status' ? value : status)

    setValues({ ...values, [name]: value })
  }

  async function handleStore(data: CatererProps) {
    setLoading(true)
    if (data.name === '' || data.status === null) {
      setLoading(false)
      return
    }
    try {
      await createCategories({
        name: data.name,
        status: data.status
      })
      handleAlert({
        message: 'Categoria cadastrada com sucesso!',
        variant: 'success'
      })
      reset()
    } catch (error) {}

    setLoading(false)
  }

  async function handleCep(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.value.length === 8) {
      try {
        const cepData = await cep(event.target.value)
        setValues({
          ...values,
          address: {
            street: cepData.street,
            district: cepData.neighborhood,
            city: cepData.city,
            state: cepData.state
          } as AdressStoreProps
        })
        setZipCode(event.target.value)
      } catch (error: any) {
        console.log(error.message)
      }
    }
  }

  async function handleCnpj(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.value.length === 14) {
      try {
        const cnpjData = await fetch(
          `https://brasilapi.com.br/api/cnpj/v1/${event.target.value}`
        )
        const cnpjJson = await cnpjData.json()

        setValues({
          name: cnpjJson.nome_fantasia,
          status: 0,
          message: '',
          address: {
            district: cnpjJson.bairro,
            city: cnpjJson.municipio,
            state: cnpjJson.uf
          } as AdressStoreProps
        })

        console.log(cnpjData.body)
      } catch (error: any) {
        console.log(error.message)
      }
    }
  }
  return (
    <Box
      component="form"
      sx={{
        margin: '0 auto',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 1rem',
        minHeight: '100vh'
      }}
      onSubmit={handleSubmit(data => handleStore(data))}
      autoComplete="off"
    >
      <Box
        sx={{
          width: '100%',
          '& > .MuiBox-root > .MuiBox-root': {
            p: 1,
            borderRadius: 2,
            fontSize: '0.875rem',
            fontWeight: '700'
          }
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 1,
            width: '100%',
            gridTemplateRows: 'auto',
            gridTemplateAreas: `"cnpj cnpj status status"
              "name name name name"
              "phone phone whatsapp whatsapp"
              "cep cep . ."
              "street street street street"
              "number number . ."
              "district district district district"
              "city city state state"
              "footer footer footer footer"`
          }}
        >
          <Grid item xs={11} mx={2} sx={{ gridArea: 'cnpj' }}>
            <FormControl
              fullWidth
              sx={{ m: 1, width: '100%' }}
              variant="standard"
            >
              <MaskInput
                mask="99.999.999/9999-99"
                value={cnpj}
                placeholder="CNPJ"
                onChange={event => {
                  setCnpj(event.target.value)
                  handleCnpj(event)
                }}
              >
                {(inputProps: any) => (
                  <TextField id="cnpj" name="cnpj" label="CNPJ" />
                )}
              </MaskInput>
            </FormControl>
          </Grid>
          <Grid item xs={11} mx={2} sx={{ gridArea: 'status' }}>
            <FormControl
              fullWidth
              sx={{ m: 1, width: '100%' }}
              variant="outlined"
            >
              <InputLabel id="status">Status</InputLabel>
              <Select
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
            </FormControl>
          </Grid>
          <Grid
            item
            xs={12}
            mx={2}
            sx={{
              gridArea: 'name'
            }}
          >
            <FormControl
              fullWidth
              sx={{ m: 1, width: '100%' }}
              variant="standard"
            >
              <TextField
                label="Nome"
                name="name"
                value={values?.name}
                sx={{ width: '100%' }}
              />
            </FormControl>
          </Grid>

          <Grid item xs={11} mx={2} sx={{ gridArea: 'phone' }}>
            <FormControl
              fullWidth
              sx={{ m: 1, width: '100%' }}
              variant="standard"
            >
              <MaskInput
                mask="(99) 99999-9999"
                placeholder="(99) 99999-9999"
                value={phone}
                onChange={event => {
                  setPhone(event.target.value)
                }}
              >
                {(inputProps: any) => (
                  <TextField id="phone" name="phone" label="Telefone" />
                )}
              </MaskInput>

              {/* <TextField label="Telefone" name="phone" sx={{ width: '100%' }} /> */}
            </FormControl>
          </Grid>

          <Grid item xs={11} mx={2} sx={{ gridArea: 'whatsapp' }}>
            <FormControl
              fullWidth
              sx={{ m: 1, width: '100%' }}
              variant="standard"
            >
              <MaskInput
                mask="(99) 99999-9999"
                placeholder="(99) 99999-9999"
                value={whatsapp}
                onChange={event => {
                  setWhatsapp(event.target.value)
                }}
              >
                {(inputProps: any) => (
                  <TextField id="whatsapp" name="whatsapp" label="Whatsapp" />
                )}
              </MaskInput>
            </FormControl>
          </Grid>
          <Grid item xs={11} mx={2} sx={{ gridArea: 'cep' }}>
            <FormControl
              fullWidth
              sx={{ m: 1, width: '100%' }}
              variant="standard"
            >
              <MaskInput
                mask="99999-999"
                placeholder="00000-000"
                value={zipCode && zipCode}
                onChange={event => {
                  setZipCode(event.target.value)
                  handleCep(event)
                }}
              >
                {(inputProps: any) => (
                  <TextField id="zipCode" name="zipCode" label="CEP" />
                )}
              </MaskInput>
            </FormControl>
          </Grid>

          <Grid item xs={11} mx={2} sx={{ gridArea: 'street' }}>
            <FormControl
              fullWidth
              sx={{ m: 1, width: '100%' }}
              variant="standard"
            >
              <TextField
                label="Rua"
                name="street"
                value={values.address?.street}
                sx={{ width: '100%' }}
              />
            </FormControl>
          </Grid>

          <Grid item xs={11} mx={2} sx={{ gridArea: 'number' }}>
            <FormControl sx={{ m: 1, width: '100%' }} variant="standard">
              <TextField
                label="Número"
                name="number"
                value={values.address?.number}
                sx={{ width: '100%' }}
              />
            </FormControl>
          </Grid>

          <Grid item xs={11} mx={2} sx={{ gridArea: 'city' }}>
            <FormControl sx={{ m: 1, width: '100%' }} variant="standard">
              <TextField
                label="Cidade"
                name="city"
                value={values.address?.city}
                sx={{ width: '100%' }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={11} mx={2} sx={{ gridArea: 'state' }}>
            <FormControl sx={{ m: 1, width: '100%' }} variant="standard">
              <TextField
                label="Estado"
                name="state"
                value={values.address?.state}
                sx={{ width: '100%' }}
              />
            </FormControl>
          </Grid>
          <Box sx={{ gridArea: 'footer' }}>
            <LoadingButton
              type="submit"
              endIcon={<SaveIcon />}
              loading={loading}
              loadingPosition="end"
              variant="contained"
              color="success"
              size="large"
              sx={{
                width: '100%'
              }}
            >
              Salvar
            </LoadingButton>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default StoreCategory
