import React, { useState } from 'react'
import { Button, Container, Drawer, Fab, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import Box from '@mui/material/Box'

function Drawing({ children, anchor, title }) {
  const [state, setState] = useState(false)

  const toggleDrawer = open => () => {
    setState(open)
  }

  return (
    <div>
      <Fab
        color="secondary"
        aria-label="add"
        onClick={toggleDrawer(true)}
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
        open={state}
        variant="temporary"
        disableEscapeKeyDown={true}
      >
        <Box
          sx={{
            minWidth: '32rem'
          }}
        >
          <Typography variant="h4" component="h4" align="center" m={2}>
            {title}
          </Typography>
          <Container maxWidth="sm">{children}</Container>
        </Box>
        <Button onClick={toggleDrawer(false)}>Fechar</Button>
      </Drawer>
    </div>
  )
}

export default Drawing
