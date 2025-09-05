'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'
// Dark mode icons preserved for easy reactivation
// import { Moon, Sun } from 'lucide-react'

interface User {
  id: string
  handle: string
  avatarUrl?: string
}

export default function SimpleHeader() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  // Local theme state to handle hydration issues
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  
  useEffect(() => {
    setMounted(true)
    // Force light mode by default - Dark mode code preserved but disabled
    setTheme('light')
    document.documentElement.classList.remove('dark')
    
    /* Dark mode detection - DISABLED but preserved for easy reactivation
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark'
    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    const initialTheme = savedTheme || systemPreference
    setTheme(initialTheme)
    
    // Apply initial theme to document
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    */
  }, [])
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    
    // Apply to document
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

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

    // Listen for login events to refresh user data
    const handleLogin = () => {
      fetchUser()
    }

    // Listen for custom login event
    window.addEventListener('userLogin', handleLogin)
    
    // Also listen for focus events to refresh user data when returning to tab
    window.addEventListener('focus', fetchUser)

    return () => {
      window.removeEventListener('userLogin', handleLogin)
      window.removeEventListener('focus', fetchUser)
    }
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

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
    <header className="bg-white dark:bg-dark-bg border-b-4 border-black dark:border-dark-border transition-colors">
      <div className="max-w-6xl mx-auto py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-black dark:text-dark-text">
          NOTHINGFEED <span className="relative">
            <span className="inline-block transform -translate-y-0.5" style={{transform: 'translateY(-3px)'}}>:</span>I
          </span>
        </Link>
        
        <nav className="flex items-center space-x-6">
          {/* Theme Toggle Button - HIDDEN but code preserved for easy reactivation
          <button
            onClick={toggleTheme}
            className="p-2 bg-gray-100 dark:bg-dark-bg border-2 border-black dark:border-dark-border shadow-[2px_2px_0px_0px_#000000] dark:shadow-[2px_2px_0px_0px_#ffffff] hover:shadow-[3px_3px_0px_0px_#000000] dark:hover:shadow-[3px_3px_0px_0px_#ffffff] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-200"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon size={20} className="text-black dark:text-dark-text" />
            ) : (
              <Sun size={20} className="text-black dark:text-dark-text" />
            )}
          </button>
          */}
          {!isLoading && (
            <>
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-12 h-12 bg-gray-200 dark:bg-dark-bg border-2 border-black dark:border-dark-border shadow-[3px_3px_0px_0px_#000000] dark:shadow-[3px_3px_0px_0px_#ffffff] flex items-center justify-center overflow-hidden hover:shadow-[4px_4px_0px_0px_#000000] dark:hover:shadow-[4px_4px_0px_0px_#ffffff] transition-shadow">
                      {user.avatarUrl ? (
                        <Image
                          src={user.avatarUrl}
                          alt={`${user.handle}'s avatar`}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                          priority
                        />
                      ) : (
                        <span className="text-lg font-bold text-black dark:text-dark-text">
                          {user.handle?.charAt(0)?.toUpperCase() || '?'}
                        </span>
                      )}
                    </div>
                    <span className="text-lg font-bold text-black dark:text-dark-text">
                      @{user.handle}
                    </span>
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-bg border-2 border-black dark:border-dark-border shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#ffffff] z-50">
                      <Link
                        href={`/profile/${user.handle}`}
                        className="block px-4 py-2 text-black dark:text-dark-text hover:bg-gray-50 dark:hover:bg-gray-900 border-b border-gray-200 dark:border-dark-border"
                      >
                        Profile
                      </Link>
                      <Link
                        href="/settings"
                        className="block px-4 py-2 text-black dark:text-dark-text hover:bg-gray-50 dark:hover:bg-gray-900 border-b border-gray-200 dark:border-dark-border"
                      >
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-black dark:text-dark-text hover:bg-gray-50 dark:hover:bg-gray-900"
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
                    className="px-4 py-2 border-2 border-black dark:border-dark-border bg-white dark:bg-dark-bg text-black dark:text-dark-text hover:bg-gray-50 dark:hover:bg-gray-900 shadow-[2px_2px_0px_0px_#000000] dark:shadow-[2px_2px_0px_0px_#ffffff] hover:shadow-[3px_3px_0px_0px_#000000] dark:hover:shadow-[3px_3px_0px_0px_#ffffff] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-200 font-bold"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 bg-black dark:bg-dark-text text-white dark:text-dark-bg border-2 border-black dark:border-dark-text hover:bg-gray-800 dark:hover:bg-gray-300 shadow-[2px_2px_0px_0px_#000000] dark:shadow-[2px_2px_0px_0px_#ffffff] hover:shadow-[3px_3px_0px_0px_#000000] dark:hover:shadow-[3px_3px_0px_0px_#ffffff] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-200 font-bold"
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