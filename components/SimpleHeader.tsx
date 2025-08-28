'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

interface User {
  id: string
  handle: string
  avatarUrl?: string
}

export default function SimpleHeader() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/me')
        if (response.ok) {
          const data = await response.json()
          if (data.isLoggedIn && data.user) {
            setUser(data.user)
          } else {
            setUser(null)
          }
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

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      window.location.href = '/'
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <header className="bg-white border-b-4 border-black">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-black">
          NOTHINGFEED <span className="relative">
            <span className="inline-block transform -translate-y-0.5">:</span>I
          </span>
        </Link>
        
        <nav className="flex items-center space-x-6">
          {!isLoading && (
            <>
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-12 h-12 bg-gray-200 border-2 border-black shadow-[3px_3px_0px_0px_#000000] flex items-center justify-center overflow-hidden hover:shadow-[4px_4px_0px_0px_#000000] transition-shadow">
                      {user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-lg font-bold text-black">
                          {user.handle?.charAt(0)?.toUpperCase() || '?'}
                        </span>
                      )}
                    </div>
                    <span className="text-lg font-bold text-black">
                      @{user.handle}
                    </span>
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border-2 border-black shadow-lg z-50">
                      <Link
                        href={`/profile/${user.handle}`}
                        className="block px-4 py-2 text-black hover:bg-gray-50 border-b border-gray-200"
                      >
                        Profile
                      </Link>
                      <Link
                        href="/settings"
                        className="block px-4 py-2 text-black hover:bg-gray-50 border-b border-gray-200"
                      >
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-black hover:bg-gray-50"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-x-4">
                  <Link
                    href="/login"
                    className="px-4 py-2 border-2 border-black bg-white text-black hover:bg-gray-50"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 bg-black text-white border-2 border-black hover:bg-gray-800"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  )
}