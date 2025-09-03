'use client'

import SimpleHeader from '@/components/SimpleHeader'
import Footer from '@/components/Footer'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg transition-colors">
      <SimpleHeader />
      <main className="max-w-6xl mx-auto py-8">
        {children}
      </main>
      <Footer />
    </div>
  )
}