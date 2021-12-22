import React from 'react'
import Drawing from '../../components/Drawing'
import Layout from '../../components/Layout'
import StoreCategory from './store'

function Category() {
  return (
    <Layout>
      <h1>Category</h1>
      <Drawing anchor="bottom" title="Cadastro de Categoria">
        <StoreCategory />
      </Drawing>
    </Layout>
  )
}

export default Category
