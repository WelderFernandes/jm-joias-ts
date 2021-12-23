import React from 'react'
import Drawing from '../../components/Drawing'
import Layout from '../../components/Layout'
import StoreCategory from './store'
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid'

function Category() {
  const rows: GridRowsProp = [
    { id: 1, name: 'Hello', slug: 'World', status: 'Active', action: '' },
    { id: 2, name: 'Hello', slug: 'World', status: 'Active', action: '' },
    { id: 3, name: 'Hello', slug: 'World', status: 'Active', action: '' }
  ]
  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Nome', width: 150 },
    { field: 'slug', headerName: 'Slug', width: 150 },
    { field: 'status', headerName: 'Status', width: 150 },
    { field: 'action', headerName: 'Ações', width: 150 }
  ]

  return (
    <Layout>
      <h1>Category</h1>
      <div style={{ height: 300, width: '100%', background: 'white' }}>
        <DataGrid rows={rows} columns={columns} />
      </div>
      <Drawing anchor="right" title="Cadastro de Categoria">
        <StoreCategory />
      </Drawing>
    </Layout>
  )
}

export default Category
