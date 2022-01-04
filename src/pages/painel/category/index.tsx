import React, { useContext, useState, SyntheticEvent, forwardRef } from 'react'
import Drawing from '../../../components/Drawing'
import { Layout } from '../../../components/Layout'
import StoreCategory from './store'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

import { CategoryContext } from '../../../contexts/CategoryContext'
import CustomAlert from '../../../components/Alert'

function Category() {
  const { categories } = useContext(CategoryContext)

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Nome', editable: true, width: 300 },
    { field: 'slug', headerName: 'Slug', editable: true, width: 300 },
    { field: 'status', headerName: 'Status', editable: true, width: 300 },
    {
      field: 'created_at',
      headerName: 'Data de Criação',
      editable: true,
      width: 300
    },
    {
      field: 'updated_at',
      headerName: 'Data de Atualização',
      editable: true,
      width: 300
    }
  ]

  return (
    <Layout>
      <h1>Category</h1>
      <div style={{ height: 500, width: '100%', background: 'white' }}>
        <DataGrid
          rows={categories}
          columns={columns}
          editMode="row"
          checkboxSelection
        />
      </div>
      <Drawing anchor="right" title="Cadastro de Categoria">
        <StoreCategory />
      </Drawing>
      <CustomAlert />
    </Layout>
  )
}

export default Category
