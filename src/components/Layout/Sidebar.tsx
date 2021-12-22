import Drawer from '@mui/material/Drawer'
import { Box } from '@mui/material/node_modules/@mui/system'

function Sidebar() {
  <>
  <Box
    component="nav"
    sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
  >
    {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
    <Drawer
      container={container}
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
}
</>
}

export default sidebar
