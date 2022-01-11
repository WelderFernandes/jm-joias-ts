import { useContext, useState, MouseEvent } from 'react'
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
import { AuthContext } from '../../contexts/AuthContext'
import { Button } from '@mui/material'
import PowerSettingsNewOutlinedIcon from '@mui/icons-material/PowerSettingsNewOutlined'
import ListSubheader from '@mui/material/ListSubheader'
import Collapse from '@mui/material/Collapse'
import ListItemButton from '@mui/material/ListItemButton'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import { destroyCookie, parseCookies } from 'nookies'
import { api } from '../../services/api'

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import Menu, { MenuProps } from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import SettingsIcon from '@mui/icons-material/Settings'
import { styled, alpha } from '@mui/material/styles'
import { LoadingButton } from '@mui/lab'

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

export function Layout({ children, title }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const openMenu = Boolean(anchorEl)
  const [loading, setLoading] = useState(false)

  const handleClickMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const { user } = useContext(AuthContext)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }
  const currentDate = format(new Date(), 'EEEEEE, d MMMM', {
    locale: ptBR
  })

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

  const handleClick = () => {
    setOpen(!open)
  }

  async function handleLogout() {
    const token = parseCookies().token
    if (!token) {
      setLoading(true)
      await api.post('/api/logout').then(() => {
        return destroyCookie(null, 'memeli.token')
      })
      router.push('/login')
    }
  }
  const StyledMenu = styled((props: MenuProps) => (
    <Menu
      elevation={0}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      {...props}
    />
  ))(({ theme }) => ({
    '& .MuiPaper-root': {
      borderRadius: 6,
      marginTop: theme.spacing(1),
      minWidth: 180,
      color:
        theme.palette.mode === 'light'
          ? 'rgb(55, 65, 81)'
          : theme.palette.grey[300],
      boxShadow:
        'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
      '& .MuiMenu-list': {
        padding: '4px 0'
      },
      '& .MuiMenuItem-root': {
        '& .MuiSvgIcon-root': {
          fontSize: 18,
          color: theme.palette.text.secondary,
          marginRight: theme.spacing(1.5)
        },
        '&:active': {
          backgroundColor: alpha(
            theme.palette.primary.main,
            theme.palette.action.selectedOpacity
          )
        }
      }
    }
  }))
  const drawer = (
    <div>
      <Image src="/logo.png" alt="Logo" width={400} height={125} />
      <Divider
        light={true}
        variant="middle"
        sx={{
          background: '#FFF',
          opacity: 0.1
        }}
      />
      <ThemeProvider theme={theme}>
        <Box m={2}>
          <Button
            id="settings"
            aria-controls={open ? 'demo-customized-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            variant="contained"
            // disableElevation
            onClick={handleClickMenu}
            endIcon={<SettingsIcon />}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              width: '100%'
            }}
          >
            <Typography noWrap component="div">
              {user?.name}
            </Typography>
          </Button>
          <StyledMenu
            id="demo-customized-menu"
            MenuListProps={{
              'aria-labelledby': 'demo-customized-button'
            }}
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleClose}
          >
            <MenuItem
              disableRipple
              sx={{
                border: 'none',
                padding: '0',
                '&:hover': {
                  opacity: 0.8
                }
              }}
            >
              {' '}
              <LoadingButton
                onClick={() => {
                  handleLogout()
                }}
                loading={loading}
                loadingPosition="center"
              >
                <PowerSettingsNewOutlinedIcon />
                Sair
              </LoadingButton>
            </MenuItem>
          </StyledMenu>
        </Box>
        <Divider
          light={true}
          variant="middle"
          sx={{
            background: '#FFF',
            opacity: 0.1
          }}
        />

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            justifyContent: 'center',
            justifyItems: 'space-between',
            alignContent: 'space-between',
            alignSelf: 'space-between'
          }}
        >
          <List
            subheader={
              <ListSubheader
                sx={{
                  background: '#161624',
                  color: '#ccc',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  opacity: 0.5
                }}
                component="div"
                id="nested-list-subheader"
              >
                Geral
              </ListSubheader>
            }
          >
            {SidebarItems.map((item, index) => (
              <Link href={item.url} key={index}>
                {item.submenu ? (
                  <>
                    <ListItem
                      button
                      onClick={handleClick}
                      sx={[
                        {
                          color: '#FFF',
                          background: open ? '#161628' : '#161624',
                          boxShadow: open ? 4 : 'none',
                          opacity: open ? 1 : 0.4,
                          borderRight: open ? '3px solid #fff' : ''
                        },
                        {
                          '&:hover': {
                            color: '#fff',
                            opacity: 0.5
                          }
                        }
                      ]}
                    >
                      <ListItemIcon
                        sx={{
                          color: '#FFF'
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        sx={{
                          color: '#FFF'
                        }}
                        primary={item.name}
                      />
                      {open ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {item.submenu.map((subitem, index) => (
                          <Link href={subitem.url} key={index}>
                            <ListItem
                              button
                              selected={isSelected(subitem.url)}
                              sx={{
                                marginLeft: '1rem',
                                color: '#FFF',
                                boxShadow: isSelected(subitem.url) ? 4 : 'none',
                                opacity: isSelected(subitem.url) ? 1 : 0.4,
                                borderRight: isSelected(subitem.url)
                                  ? '3px solid #fff'
                                  : ''
                              }}
                            >
                              <ListItemIcon
                                sx={{
                                  color: '#FFF'
                                }}
                              >
                                {subitem.icon}
                              </ListItemIcon>
                              <ListItemText
                                sx={{
                                  color: '#FFF'
                                }}
                                primary={subitem.name}
                              />
                            </ListItem>
                          </Link>
                        ))}
                      </List>
                    </Collapse>
                  </>
                ) : (
                  <ListItemButton
                    sx={[
                      {
                        color: '#FFF',
                        background: isSelected(item.url)
                          ? '#161628'
                          : '#161624',
                        boxShadow: isSelected(item.url) ? 4 : 'none',
                        opacity: isSelected(item.url) ? 1 : 0.4,
                        borderRight: isSelected(item.url)
                          ? '3px solid #fff'
                          : ''
                      },
                      {
                        '&:hover': {
                          color: '#fff',
                          opacity: 0.5
                        }
                      }
                    ]}
                  >
                    <ListItemIcon
                      sx={{
                        color: '#FFF'
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.name}
                      sx={{
                        color: '#FFF'
                      }}
                    />
                  </ListItemButton>
                )}
              </Link>
            ))}
          </List>
          <Box
            mr={2}
            ml={2}
            sx={{
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              fill: '#FFF',
              marginBottom: '0px'
            }}
          >
            {/* <Button
              variant="outlined"
              onClick={() => {
                handleLogout()
              }}
              sx={{
                color: '#FFF',
                background: '#161624',
                border: '1px solid #ccc',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                width: '100%',
                height: '3rem',
                marginTop: '1rem',
                '&:hover': {
                  color: '#fff',
                  background: '#161628',
                  border: '1px solid #fff'
                }
              }}
              startIcon={<PowerSettingsNewOutlinedIcon />}
            >
              SAIR
            </Button> */}
          </Box>
          <Divider />
        </Box>
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
