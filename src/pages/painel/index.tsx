import { Layout } from '../../components/Layout'
import { GetServerSideProps } from 'next'
import { parseCookies } from 'nookies'
import { getApiClient } from '../../services/axios'
export default function Index() {
  return (
    <>
      <Layout>
        <h1>Dashboard</h1>
      </Layout>
    </>
  )
}
export const getServerSideProps: GetServerSideProps = async ctx => {
  // const apiClient = getApiClient(ctx)
  const { ['memeli.token']: token } = parseCookies(ctx)
  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }
  // await apiClient.get('/auth/me', token)
  return {
    props: {}
  }
}

///https://material-kit-pro-react.devias.io/dashboard
