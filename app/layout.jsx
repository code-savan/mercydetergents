// import { AuthProvider } from './context/AuthContext'
import './globals.css'

export const metadata = {
  title: 'Mercy Peter Detergents',
  description: 'Quality detergents for your home and business',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
