import { Layout } from '../../components/Layout'
import { GetServerSideProps } from 'next'
import { parseCookies } from 'nookies'
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
  const { ['memeli.token']: token } = parseCookies(ctx)

  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }
  return {
    props: {}
  }
}
