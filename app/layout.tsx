import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ywc20',
  description: 'Created with ywc20',
  generator: 'ywc20.ywc.in.th',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
