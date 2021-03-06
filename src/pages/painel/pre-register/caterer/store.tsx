import { Box, FormHelperText, Grid, useFormControl } from '@mui/material'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { ChangeEvent, useContext, useEffect, useState, useRef } from 'react'
import SaveIcon from '@mui/icons-material/Save'
import { LoadingButton } from '@mui/lab'
import Container from '@mui/material/Container'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { CategoryContext } from '../../../../contexts/CategoryContext'
import Input from '@mui/material/Input'

import { pt } from 'yup-locale-pt'
import cep from 'cep-promise'
import MaskInput from '../../../../components/MaskInput'
import { Form } from '@unform/web'
import InputMask from '../../../../components/InputMask/Index'
import InputSimple from '../../../../components/InputSimple'
import { Scope, SubmitHandler, FormHandles } from '@unform/core'

Yup.setLocale(pt)

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
  cnpj: string
  status: number
  message?: string
  address?: AdressStoreProps
}
type ErrorMessage = {
  [key: string]: string
}
function StoreCategory() {
  const { createCategories, handleAlert } = useContext(CategoryContext)
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [zipCode, setZipCode] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [phone, setPhone] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  // const {
  //   register,
  //   // handleSubmit,
  //   reset,
  //   formState: { errors }
  // } = useForm<CatererProps>({
  //   resolver: yupResolver(schema) // yup, joi and even your own.
  // })

  const formRef = useRef<FormHandles>(null)

  const [values, setValues] = useState<CatererProps>({
    name: '',
    status: 0,
    cnpj: '',
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
    // setLoading(true)
    // if (data.name === '' || data.status === null) {
    //   setLoading(false)
    //   return
    // }
    // try {
    //   await createCategories({
    //     name: data.name,
    //     status: data.status
    //   })
    //   handleAlert({
    //     message: 'Categoria cadastrada com sucesso!',
    //     variant: 'success'
    //   })
    //   reset()
    // } catch (error) {}

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
          cnpj: cnpjJson.cnpj,
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

  async function handleSubmit(data: FormData, { reset }: any) {
    setValues(data)
    console.log('values', values)
    try {
      const schema = Yup.object()
        .shape({
          name: Yup.string().required(),
          phone: Yup.string().required(),
          whatsapp: Yup.string().required(),
          zipCode: Yup.string().required(),
          cnpj: Yup.string().required(),
          status: Yup.number().required(),
          address: Yup.object().shape({
            street: Yup.string().required(),
            number: Yup.string().required(),
            district: Yup.string().required(),
            city: Yup.string().required(),
            state: Yup.string().required()
          })
        })
        .required()

      await schema.validate(data, {
        abortEarly: false
      })

      formRef.current?.setErrors({})
      reset()
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errorMessages = {} as ErrorMessage

        err.inner.forEach(error => {
          if (typeof error.path !== 'undefined') {
            errorMessages[error.path] = error.message
          }
        })

        formRef.current?.setErrors(errorMessages)
      }
    }
  }

  // const inititalData = {
  //   name: '',
  //   status: 0,
  //   cnpj: '',
  //   message: '',
  //   address: {
  //     street: '',
  //     number: '',
  //     district: '',
  //     city: '',
  //     state: '',
  //     zipCode: ''
  //   } as AdressStoreProps
  // }

  return (
    <>
      <Form ref={formRef} onSubmit={handleSubmit} initialData={values}>
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
                <InputMask mask="99.999.999/9999-99" name="cnpj" label="Cnpj" />
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
                <InputSimple name="name" label="Nome" variant="outlined" />
                {/* <TextField name="name" label="Nome" /> */}
              </FormControl>
            </Grid>

            <Grid item xs={11} mx={2} sx={{ gridArea: 'phone' }}>
              <FormControl
                fullWidth
                sx={{ m: 1, width: '100%' }}
                variant="standard"
              >
                <InputMask
                  mask="(99) 99999-9999"
                  name="phone"
                  label="Telefone"
                />
              </FormControl>
            </Grid>

            <Grid item xs={11} mx={2} sx={{ gridArea: 'whatsapp' }}>
              <FormControl
                fullWidth
                sx={{ m: 1, width: '100%' }}
                variant="standard"
              >
                <InputMask
                  mask="(99) 99999-9999"
                  name="whatsapp"
                  label="Whatsapp"
                />
              </FormControl>
            </Grid>

            <Scope path="address">
              <Grid item xs={11} mx={2} sx={{ gridArea: 'cep' }}>
                <FormControl
                  fullWidth
                  sx={{ m: 1, width: '100%' }}
                  variant="standard"
                >
                  <InputMask mask="9999-999" name="zipCode" label="Cep" />
                </FormControl>
              </Grid>

              <Grid item xs={11} mx={2} sx={{ gridArea: 'street' }}>
                <FormControl
                  fullWidth
                  sx={{ m: 1, width: '100%' }}
                  variant="standard"
                >
                  <InputSimple
                    name="street"
                    label="Rua"
                    variant="outlined"
                    value={values.address?.street}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={11} mx={2} sx={{ gridArea: 'number' }}>
                <FormControl sx={{ m: 1, width: '100%' }} variant="standard">
                  <InputSimple
                    name="number"
                    label="N??mero"
                    variant="outlined"
                    value={values.address?.number}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={11} mx={2} sx={{ gridArea: 'city' }}>
                <FormControl sx={{ m: 1, width: '100%' }} variant="standard">
                  <InputSimple
                    name="city"
                    label="Cidade"
                    variant="outlined"
                    value={values.address?.city}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={11} mx={2} sx={{ gridArea: 'state' }}>
                <FormControl sx={{ m: 1, width: '100%' }} variant="standard">
                  <InputSimple
                    name="state"
                    label="Estado"
                    variant="outlined"
                    value={values.address?.state}
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
            </Scope>
          </Box>
        </Box>
      </Form>
    </>
  )
}

export default StoreCategory
