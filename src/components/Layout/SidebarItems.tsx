import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import ProductionQuantityLimitsRoundedIcon from '@mui/icons-material/ProductionQuantityLimitsRounded'
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded'
import AddShoppingCartRoundedIcon from '@mui/icons-material/AddShoppingCartRounded'
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'

export const SidebarItems = [
  {
    name: 'Dashboard',
    icon: <HomeRoundedIcon />,
    url: '/Dashboard'
  },
  {
    name: 'Produtos',
    icon: <ProductionQuantityLimitsRoundedIcon />,
    url: '/product'
  },
  {
    name: 'Categoria',
    icon: <CategoryRoundedIcon />,
    url: '/category'
  },
  {
    name: 'Revendedor',
    icon: <StorefrontRoundedIcon />,
    url: '/'
  },
  {
    name: 'Fornecedor',
    icon: <AddShoppingCartRoundedIcon />,
    url: '/'
  }
]
