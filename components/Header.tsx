'use client'

import Link from 'next/link'
import { useState } from 'react'

interface HeaderProps {
  user: any
  isLoading: boolean
  avatarUrl?: string
}

export default function Header({ user, isLoading, avatarUrl }: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      window.location.href = '/'
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <header className="bg-white border-b-4 border-black">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-black">
          NOTHINGFEED :I
        </Link>
        
        <nav className="flex items-center space-x-6">
          {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 p-2 border-2 border-black bg-white hover:bg-gray-50"
                  >
                    <div className="w-8 h-8 bg-gray-200 border-2 border-black flex items-center justify-center text-black text-sm font-bold overflow-hidden">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        user?.handle?.charAt(0)?.toUpperCase() || '?'
                      )}
                    </div>
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border-2 border-black shadow-lg z-50">
                      {user?.handle && (
                        <Link
                          href={`/profile/${user.handle}`}
                          className="block px-4 py-2 text-black hover:bg-gray-50 border-b border-gray-200"
                        >
                          Profile
                        </Link>
                      )}
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
        </nav>
      </div>
    </header>
  )
}