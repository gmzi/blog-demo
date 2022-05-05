import '../styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'

export default function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider
      enableSystem={true}
      defaultTheme="system"
      enableColorScheme={true}
      >
        <Component {...pageProps} />  
      </ThemeProvider>
    </SessionProvider>
  )
}

