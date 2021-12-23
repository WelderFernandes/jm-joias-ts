import React, { ReactNode, useState } from 'react'
import Box from '@mui/material/Box'
import { Button, Drawer, Typography } from '@mui/material'
import { Container, Fab } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined'

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
    <Container>
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
          <Box
            component="div"
            mt={2}
            sx={{
              display: 'flex',
              justifyContent: 'stretch',
              alignItems: 'center',
              minWidth: '22rem'
            }}
          >
            <Box>
              <Button
                onClick={toggleDrawer(anchor, false)}
                sx={{
                  backgroundColor: 'white',
                  borderRadius: '50%'
                }}
              >
                <ArrowCircleLeftOutlinedIcon fontSize="large" />
              </Button>
            </Box>
            <Box>
              <Typography variant="boddy2" component="h4">
                {title}
              </Typography>
            </Box>
            <Box>
              <Typography variant="boddy2" component="h4"></Typography>
            </Box>
          </Box>
          {children}
        </Drawer>
      </Box>
    </Container>
  )
}
