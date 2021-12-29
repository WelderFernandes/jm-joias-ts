import React, { useEffect, useState } from 'react'
import Drawing from '../../../components/Drawing'
import { Layout } from '../../../components/Layout'
import StoreCategory from './store'
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid'
import { api } from '../../../services/api'

function Category() {
  const [dataTable, setDataTable] = useState([])

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Nome', editable: true, width: 300 },
    { field: 'slug', headerName: 'Slug', editable: true, width: 300 },
    { field: 'status', headerName: 'Status', editable: true, width: 300 }
  ]

  useEffect(() => {
    api.get('/api/category').then(response => {
      setDataTable(response.data.data)
    })
  }, [])

  return (
    <Layout>
      <h1>Category</h1>
      <div style={{ height: 500, width: '100%', background: 'white' }}>
        <DataGrid
          rows={dataTable}
          columns={columns}
          editMode="row"
          pageSize={10}
          checkboxSelection
        />
      </div>
      <Drawing anchor="right" title="Cadastro de Categoria">
        <StoreCategory />
      </Drawing>
    </Layout>
  )
}

export default Category
