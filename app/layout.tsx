import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Red vs Blue — Your city. Your colour.',
  description: 'Buy a pixel. Claim your territory. Win for your youth.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}