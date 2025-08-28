import type { Metadata } from 'next'
import './globals.css'
import SimpleHeader from '@/components/SimpleHeader'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'NOTHINGFEED',
  description: 'A platform for deleting content - write, post, delete. Only metadata remains.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-white">
          <SimpleHeader />
          <main className="max-w-6xl mx-auto py-8">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}