import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import MenuIcon from '@mui/icons-material/Menu'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Head from 'next/head'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { SidebarItems } from './SidebarItems'
import Link from 'next/link'
import format from 'date-fns/format'
import ptBR from 'date-fns/locale/pt-BR'
import Image from 'next/image'
import { ReactNode, ReactPropTypes } from 'react'
import { useRouter } from 'next/router'

const drawerWidth = 240

type LayoutProps = {
  children?: ReactNode
  title?: string
}

type SidebarProps = {
  index?: number
  name: string
  url: string
  icon: React.ComponentType<{}>
  active?: boolean
}

function Layout({ children, title }: LayoutProps) {
  // const { window } = props
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const router = useRouter()

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }
  const currentDate = format(new Date(), 'EEEEEE, d MMMM', {
    locale: ptBR
  })

  // const container =
  //   window !== undefined ? () => window().document.body : undefined

  const theme = createTheme({
    palette: {
      primary: {
        main: '#161624'
      }
    }
  })

  const isSelected = (url: string) => {
    return router.pathname === url
  }

  const drawer = (
    <div>
      <Box
        m={2}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Image src="/logo.png" alt="Logo" width={120} height={120} />
      </Box>
      <ThemeProvider theme={theme}>
        <Divider
          light={true}
          variant="middle"
          sx={{
            background: '#FFF',
            opacity: 0.1
          }}
        />
        <List>
          {SidebarItems.map((item, index) => (
            <Link href={item.url} key={index}>
              <ListItem
                button={true}
                sx={[
                  {
                    color: '#fff',
                    opacity: isSelected(item.url) ? 1 : 0.5,
                    borderRight: isSelected(item.url) ? '3px solid #fff' : ''
                  },
                  {
                    '&:hover': {
                      color: '#fff',
                      opacity: 0.5
                    }
                  }
                ]}
                onClick={() => {
                  setMobileOpen(false)
                }}
              >
                <ListItemIcon
                  sx={{
                    color: 'white'
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItem>
            </Link>
          ))}
        </List>
        <Divider />
      </ThemeProvider>
    </div>
  )
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
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Drawer
            // container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true // Better open performance on mobile.
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
                backgroundColor: '#161624',
                color: 'white'
              }
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
                backgroundColor: '#161624',
                color: 'white'
              }
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

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
