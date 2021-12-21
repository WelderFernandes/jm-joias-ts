import React from 'react'
import Drawing from '../../components/Drawing'
import Layout from '../../components/Layout'
import CreateCategory from './create'

function Category() {
  return (
    <Layout>
      <h1>Category</h1>
      <Drawing anchor="bottom" title="Cadastrar">
        <CreateCategory />
      </Drawing>
    </Layout>
  )
}

export default Category
