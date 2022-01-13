import { useContext, useState } from 'react'
import Avatar from '@mui/material/Avatar'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { useForm } from 'react-hook-form'
import { AuthContext } from '../../contexts/AuthContext'
import { LoadingButton } from '@mui/lab'
import Alert from '@mui/material/Alert'
import IconButton from '@mui/material/IconButton'
import Collapse from '@mui/material/Collapse'
import CloseIcon from '@mui/icons-material/Close'
import Image from 'next/image'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {'Copyright © '}
      <Link color="inherit" href="#">
        RM SOLUÇÔES TECNOLOGICAS {new Date().getFullYear()}
      </Link>
      {'.'}
    </Typography>
  )
}

type Data = {
  email: string
  password: string
}

const theme = createTheme()

const schema = yup
  .object()
  .shape({
    email: yup.string().email().required(),
    password: yup.string().required()
  })
  .required()

export default function SignInSide() {
  const { register, handleSubmit } = useForm<Data>({
    resolver: yupResolver(schema) // yup, joi and even your own.
  })

  const { signIn } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  async function handleSignIn(data: Data) {
    console.log(data)
    try {
      if (data.email === '' || data.password === '') {
        setOpen(true)
        setLoading(false)
        return
      }
      setLoading(true)
      await signIn(data)
    } catch (error) {
      setOpen(true)

      setLoading(false)
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Grid
        container
        component="main"
        sx={{ height: '100vh', display: 'flex' }}
      >
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={9}
          sx={{
            // backgroundImage: 'url(https://source.unsplash.com/random)',
            backgroundImage: 'url(bg_login.png)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: t =>
              t.palette.mode === 'light'
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <Grid item sm={8} md={3} component={Paper} elevation={6} square>
          <Box
            alignContent="center"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '90vh',
              mx: 5
            }}
          >
            <Image src="/logo.png" alt="logo" width={320} height={100} />
            <Typography component="h1" variant="h5">
              Entrar
            </Typography>
            <Box
              component="form"
              noValidate
              sx={{ mt: 2 }}
              onSubmit={handleSubmit(data => handleSignIn(data))}
            >
              <Box sx={{ width: '100%' }}>
                <Collapse in={open}>
                  <Alert
                    severity="error"
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
                    Certidique-se que informou as credenciais corretas.
                  </Alert>
                </Collapse>
              </Box>
              <TextField
                {...register('email', {
                  required: true,
                  min: 7,
                  pattern: /^\S+@\S+$/i
                })}
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                {...register('password')}
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Lembrar-me"
              />
              <LoadingButton
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={() => handleSignIn}
                loading={loading}
              >
                ENTRAR
              </LoadingButton>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Esqueci a senha
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright
            sx={{
              display: 'flex',
              fle: '1',
              alignContent: 'center',
              alignItems: 'flex-end',
              alignSelf: 'flex-end',
              justifyContent: 'center',
              justifyItems: 'flex-end',
              justifySelf: 'flex-end',
              height: '10vh'
            }}
          />
        </Grid>
      </Grid>
    </ThemeProvider>
  )
}
