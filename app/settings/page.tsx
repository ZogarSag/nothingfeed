'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface User {
  id: string
  handle: string
  email: string
  avatarUrl?: string
  createdAt: string
}

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [newHandle, setNewHandle] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/me')
        if (response.ok) {
          const data = await response.json()
          if (data.isLoggedIn && data.user) {
            setUser(data.user)
            setNewHandle(data.user.handle)
          } else {
            router.push('/login')
          }
        } else {
          router.push('/login')
        }
      } catch (error) {
        console.error('Failed to fetch user:', error)
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [router])

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return
    }

    if (!confirm('This will permanently delete all your data. Are you absolutely sure?')) {
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch('/api/auth/delete-account', {
        method: 'DELETE',
      })

      if (response.ok) {
        alert('Your account has been deleted.')
        router.push('/')
      } else {
        alert('Failed to delete account. Please try again.')
      }
    } catch (error) {
      console.error('Failed to delete account:', error)
      alert('Failed to delete account. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleUpdateHandle = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!newHandle.trim()) {
      setError('Username cannot be empty')
      return
    }

    if (newHandle === user?.handle) {
      setIsEditing(false)
      return
    }

    try {
      const response = await fetch('/api/auth/update-handle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ handle: newHandle.trim() })
      })

      const data = await response.json()

      if (response.ok) {
        setUser(prev => prev ? { ...prev, handle: newHandle.trim() } : null)
        setSuccess('Username updated successfully!')
        setIsEditing(false)
        // Update URL if we're viewing our own profile
        router.refresh()
      } else {
        setError(data.error || 'Failed to update username')
      }
    } catch (error) {
      console.error('Failed to update handle:', error)
      setError('Failed to update username')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl text-black">Loading settings...</div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-center mb-8">
          <Card className="w-full max-w-md bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000000]">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-black text-center">Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Info */}
              <div className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-100 border-2 border-red-500 text-red-700">
                    {error}
                  </div>
                )}
                
                {success && (
                  <div className="p-3 bg-green-100 border-2 border-green-500 text-green-700">
                    {success}
                  </div>
                )}

                <div className="space-y-4">
                  {/* Username */}
                  <div className="space-y-2">
                    {isEditing ? (
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-600">Username:</span>
                        </div>
                        <form onSubmit={handleUpdateHandle} className="space-y-2">
                          <div className="flex space-x-2">
                            <span className="text-black font-bold">@</span>
                            <input
                              type="text"
                              value={newHandle}
                              onChange={(e) => setNewHandle(e.target.value)}
                              className="flex-1 px-2 py-1 border-2 border-black"
                              placeholder="username"
                              pattern="[a-zA-Z0-9_]+"
                              title="Only letters, numbers, and underscores allowed"
                            />
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              type="submit"
                              className="text-sm px-3 py-1 bg-black text-white border-2 border-black hover:bg-gray-800"
                            >
                              Save
                            </Button>
                            <Button
                              type="button"
                              onClick={() => {
                                setIsEditing(false)
                                setNewHandle(user?.handle || '')
                                setError('')
                              }}
                              className="text-sm px-3 py-1 bg-gray-100 text-black border-2 border-black hover:bg-gray-200"
                            >
                              Cancel
                            </Button>
                          </div>
                        </form>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Username:</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-black">@{user.handle}</span>
                          <button
                            onClick={() => setIsEditing(true)}
                            className="text-sm text-black underline hover:no-underline"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-bold text-black">{user.email}</span>
                  </div>
                  
                  {/* Member since */}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Member since:</span>
                    <span className="font-bold text-black">{formatDate(user.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4 border-t-2 border-black pt-6">
                <div className="space-y-3">
                  <Link href={`/profile/${user.handle}`}>
                    <Button className="w-full bg-white text-black border-2 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[6px_6px_0px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-200">
                      View My Profile
                    </Button>
                  </Link>

                  <Button
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                    className="w-full bg-red-600 text-white border-2 border-black shadow-[4px_4px_0px_0px_#000000] hover:bg-red-700 hover:shadow-[6px_6px_0px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-200"
                  >
                    {isDeleting ? 'Deleting...' : 'Delete Account'}
                  </Button>
                </div>
              </div>

              {/* Back Link */}
              <div className="text-center border-t-2 border-black pt-6">
                <Link 
                  href="/"
                  className="text-black hover:underline"
                >
                  ← Back to Feed
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}