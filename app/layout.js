import { TimerProvider } from './GlobalContext'
import './globals.css'
import { Poppins } from 'next/font/google'
import toast, { Toaster } from 'react-hot-toast';

const inter = Poppins({ subsets: ['latin'], weight:"400" })

export const metadata = {
  title: 'Purrfect Plate',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <TimerProvider>
      <body className={inter.className}>
        {children}
        <Toaster />
        </body>
      </TimerProvider>
 
    </html>
  )
}
