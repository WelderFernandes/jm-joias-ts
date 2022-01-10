import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import ProductionQuantityLimitsRoundedIcon from '@mui/icons-material/ProductionQuantityLimitsRounded'
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded'
import AddShoppingCartRoundedIcon from '@mui/icons-material/AddShoppingCartRounded'
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import ControlPointDuplicateIcon from '@mui/icons-material/ControlPointDuplicate'

export const SidebarItems = [
  {
    name: 'Dashboard',
    icon: <HomeRoundedIcon />,
    url: '/painel'
  },
  {
    name: 'Produtos',
    icon: <ProductionQuantityLimitsRoundedIcon />,
    url: '/painel/product'
  },
  {
    name: 'Categoria',
    icon: <CategoryRoundedIcon />,
    url: '/painel/category'
  },
  {
    name: 'Revendedor',
    icon: <StorefrontRoundedIcon />,
    url: '/painel/dealer'
  },
  {
    name: 'Fornecedor',
    icon: <AddShoppingCartRoundedIcon />,
    url: '/painel/provider'
  },
  {
    name: 'Pré-cadastro',
    icon: <ControlPointDuplicateIcon />,
    url: '#',
    submenu: [
      {
        name: 'Produtos',
        url: '/painel/pre-register/product',
        icon: <ProductionQuantityLimitsRoundedIcon />
      },
      {
        name: 'Categoria',
        url: '/painel/pre-register/category',
        icon: <CategoryRoundedIcon />
      }
    ]
  }
]
