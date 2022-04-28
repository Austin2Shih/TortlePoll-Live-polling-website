import '../styles/globals.css'
import Router from 'next/router'
import NProgress from 'nprogress'

function MyApp({ Component, pageProps }) {
  Router.events.on('routeChangeStart', (url) => {
    NProgress.start()
  })

  Router.events.on('routeChangeComplete', (url) => {
    NProgress.done()
  })
  return (
      <Component {...pageProps} />
  )
}

export default MyApp
