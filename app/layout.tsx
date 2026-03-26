import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'

export const metadata: Metadata = {
  title: '潔淨家 CleanHome｜台灣專業居家清潔預約平台',
  description: '輕鬆預約專業清潔師傅，涵蓋台北市各行政區，一般清潔、深度清潔、搬家清潔一站搞定',
  keywords: '居家清潔,台北清潔,清潔預約,專業清潔師',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
