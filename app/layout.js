import { Geist, Geist_Mono } from "next/font/google";
import { Antonio, Roboto, Montserrat } from "next/font/google";
import "./globals.css";
// import { AuthProvider } from "./auth/AuthContext";
// import ProtectedRoute from "./auth/ProtectedRoute";
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import { CartProvider } from './context/CartContext'
import FloatingCart from './components/FloatingCart'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const antonio = Antonio({
  variable: "--font-antonio",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'Mercy Peter Detergents | Clean Made Simple',
    description: 'Powerful, mess-free detergent designed for everyday use with no harsh chemicals.',
  }

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${antonio.variable} ${roboto.variable} ${montserrat.variable} antialiased ${inter.className}`}
      >
        <Toaster richColors closeButton position="bottom-left" expand={true} toastOptions={{
          style: { background: 'white', color: '#222' },
          className: 'border border-gray-200 shadow-lg'
        }} />
        <CartProvider>
          {children}
          <FloatingCart />
        </CartProvider>
      </body>
    </html>
  );
}
