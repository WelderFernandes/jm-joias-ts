import React, { ReactNode, useState } from 'react'
import Box from '@mui/material/Box'
import { Button, Drawer, Typography } from '@mui/material'
import { Container, Fab } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

type Anchor = 'top' | 'left' | 'bottom' | 'right'

type DrawingProps = {
  children: ReactNode
  anchor: Anchor
  title?: string
}

export default function TemporaryDrawer({
  children,
  anchor,
  title
}: DrawingProps) {
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false
  })

  const toggleDrawer = (anchor: Anchor, open: boolean) => () => {
    setState({ ...state, [anchor]: open })
  }

  return (
    <Container maxWidth="sm">
      <Box>
        <Fab
          color="secondary"
          aria-label="add"
          onClick={toggleDrawer(anchor, true)}
          sx={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem'
          }}
        >
          <AddIcon />
        </Fab>
        <Drawer
          anchor={anchor}
          open={state[anchor]}
          variant="temporary"
          disableEscapeKeyDown={true}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}
        >
          <Typography variant="h4" component="h4" align="center" mt={6}>
            {title}
          </Typography>
          {children}
          <Button
            sx={{
              margin: '2rem auto'
            }}
            onClick={toggleDrawer(anchor, false)}
          >
            Fechar
          </Button>
        </Drawer>
      </Box>
    </Container>
  )
}
