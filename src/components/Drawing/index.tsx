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
  onClose?: () => void
}

export default function TemporaryDrawer({
  children,
  anchor,
  title,
  onClose
}: DrawingProps) {
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false
  })
  const [open, setOpen] = useState(true)

  const toggleDrawer = (anchor: Anchor, open: boolean) => () => {
    setState({ ...state, [anchor]: open })
    onClose && onClose()
  }

  return (
    <Container>
      <Box>
        {/* <Fab
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
        </Fab> */}
        <Drawer
          open={open}
          anchor={anchor}
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
                  borderRadius: '50%',
                  color: '#161624'
                }}
              >
                <ArrowCircleLeftOutlinedIcon fontSize="medium" />
              </Button>
            </Box>
            <Box>
              <Typography variant="h6" component="h4">
                {title}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2"></Typography>
            </Box>
          </Box>
          {children}
        </Drawer>
      </Box>
    </Container>
  )
}
