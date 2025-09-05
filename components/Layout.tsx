'use client'

import Header from './Header'
import Footer from './Footer'
import { useEffect, useState } from 'react'
interface User {
  id: string;
  email: string;
  handle: string;
  displayName?: string;
  avatarUrl?: string | null;
  createdAt: Date;
}

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/me')
        if (response.ok) {
          const userData = await response.json()
          // API returns {isLoggedIn: false} or {isLoggedIn: true, user: {...}}
          setUser(userData.isLoggedIn ? userData.user : null)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error('Failed to fetch user:', error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Header user={user} isLoading={isLoading} avatarUrl={user?.avatarUrl || undefined} />
      <main className="max-w-6xl mx-auto py-8">
        {children}
      </main>
      <Footer />
    </div>
  )
}
