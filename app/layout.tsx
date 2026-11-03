import type { Metadata } from 'next'
import { Providers } from '@/components/providers'
import { inter, plexMono } from './fonts'
import { cn } from '@/lib/utils'
import './globals.css'

export const metadata: Metadata = {
  title: 'Solaris',
  description: 'Coding editor',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
      className={cn('antialiased', inter.variable, plexMono.variable)}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}