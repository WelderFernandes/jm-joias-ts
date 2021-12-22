import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Head from 'next/head'
import format from 'date-fns/format'
import ptBR from 'date-fns/locale/pt-BR'
import { ReactNode } from 'react'
import { useRouter } from 'next/router'
import SideBar from '../Sidebar'

const drawerWidth = 240

type LayoutProps = {
  children?: ReactNode
  title?: string
}

function Layout({ children, title }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const currentDate = format(new Date(), 'EEEEEE, d MMMM', {
    locale: ptBR
  })

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            boxShadow: 0
          }}
        >
          <Toolbar
            sx={{
              boxShadow: 'none',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'white',
              color: 'black'
            }}
          >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              {title}
            </Typography>
            <Typography
              variant="body1"
              noWrap
              component="div"
              style={{
                textTransform: 'capitalize',
                opacity: 0.5
              }}
            >
              {currentDate}
            </Typography>
          </Toolbar>
        </AppBar>

        <SideBar />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` }
          }}
        >
          <Toolbar />
          {children}
        </Box>
      </Box>
    </>
  )
}

export default Layout
