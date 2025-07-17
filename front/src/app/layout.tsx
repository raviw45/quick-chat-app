import { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import { cn } from '@/lib/utils'
import './globals.css'
import SessionProvider from '../providers/SessionProviders'
 
const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
})
 
export const metadata:Metadata={
  title:"Quick Chat App",
  description:"A simple chat application to connect with friends and family",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cn("min-h-screen bg-background font-sans antialiased",roboto.className)}>
     <SessionProvider>
       <body>{children}</body>
     </SessionProvider>
    </html>
  )
}