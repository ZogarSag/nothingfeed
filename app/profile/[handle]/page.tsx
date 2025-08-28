'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'

interface User {
  id: string
  handle: string
  avatarUrl?: string
  createdAt: string
}

interface UserStats {
  totalChars: number
  totalWords: number
  totalSentences: number
  totalActions: number
}

interface Deletion {
  id: string
  charCount: number
  wordCount: number
  sentenceCount: number
  createdAt: string
}

export default function ProfilePage() {
  const params = useParams()
  const handle = params?.handle as string
  
  const [user, setUser] = useState<User | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [stats, setStats] = useState<UserStats | null>(null)
  const [deletions, setDeletions] = useState<Deletion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!handle) return

      try {
        // Fetch current user and target profile in parallel
        const [meResponse, userResponse] = await Promise.all([
          fetch('/api/me'),
          fetch(`/api/profile/${handle}`)
        ])

        // Set current user if logged in
        if (meResponse.ok) {
          const meData = await meResponse.json()
          if (meData.isLoggedIn && meData.user) {
            setCurrentUser(meData.user)
          }
        }

        // Set profile user
        if (!userResponse.ok) {
          setError('User not found')
          return
        }

        const userData = await userResponse.json()
        setUser(userData.user)
        setStats(userData.stats)
        setDeletions(userData.deletions)
      } catch (err) {
        console.error('Failed to fetch profile:', err)
        setError('Failed to load profile')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [handle])

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploadingAvatar(true)

    try {
      const formData = new FormData()
      formData.append('avatar', file)

      const response = await fetch('/api/auth/upload-avatar', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        // Update the user state with new avatar
        setUser(prev => prev ? { ...prev, avatarUrl: result.user.avatarUrl } : null)
        setCurrentUser(prev => prev ? { ...prev, avatarUrl: result.user.avatarUrl } : null)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to upload avatar')
      }
    } catch (err) {
      console.error('Avatar upload error:', err)
      setError('Failed to upload avatar')
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  const isOwnProfile = currentUser && user && currentUser.id === user.id

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl text-black">Loading profile...</div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">💀</div>
          <h1 className="text-2xl font-bold text-black mb-2">Profile not found</h1>
          <p className="text-black mb-6">This user doesn't exist or has been deleted.</p>
          <Link 
            href="/"
            className="px-4 py-2 bg-black text-white border-2 border-black hover:bg-gray-800"
          >
            Back to Feed
          </Link>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`
    return `${Math.floor(diffInSeconds / 31536000)}y ago`
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-center mb-8">
          <Card className="w-full max-w-2xl bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000000]">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gray-200 border-2 border-black shadow-[3px_3px_0px_0px_#000000] flex items-center justify-center overflow-hidden">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.handle}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-black">
                        {user.handle.charAt(0).toUpperCase()}
                      </span>
                    )}
                    {isUploadingAvatar && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="text-white text-xs">Uploading...</div>
                      </div>
                    )}
                  </div>
                  {isOwnProfile && (
                    <div className="mt-2">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                          disabled={isUploadingAvatar}
                        />
                        <div className="text-xs text-center px-2 py-1 border-2 border-black bg-white hover:bg-gray-50 transition-colors">
                          {isUploadingAvatar ? 'Uploading...' : 'Change Avatar'}
                        </div>
                      </label>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-black">@{user.handle}</h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Member since {formatDate(user.createdAt)}
                  </p>
                </div>
              </div>

              {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 border-2 border-black bg-gray-50">
                    <div className="text-2xl font-bold text-black">{stats.totalActions}</div>
                    <div className="text-sm text-gray-600">Deletions</div>
                  </div>
                  <div className="text-center p-3 border-2 border-black bg-gray-50">
                    <div className="text-2xl font-bold text-black">{stats.totalChars.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Characters</div>
                  </div>
                  <div className="text-center p-3 border-2 border-black bg-gray-50">
                    <div className="text-2xl font-bold text-black">{stats.totalWords.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Words</div>
                  </div>
                  <div className="text-center p-3 border-2 border-black bg-gray-50">
                    <div className="text-2xl font-bold text-black">{stats.totalSentences.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Sentences</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-black text-center">Recent Destructions</h2>
          
          {deletions.length === 0 ? (
            <div className="flex justify-center">
              <Card className="w-full max-w-2xl text-center py-16 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000000]">
                <CardContent>
                  <div className="text-6xl mb-4">😇</div>
                  <h3 className="text-2xl font-bold text-black mb-2">No destructions yet!</h3>
                  <p className="text-black">This user hasn't deleted anything yet.</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            deletions.map((deletion) => (
              <div key={deletion.id} className="flex justify-center">
                <Card className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[6px_6px_0px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-200 w-full max-w-2xl">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 border-2 border-black shadow-[3px_3px_0px_0px_#000000] flex items-center justify-center">
                          <span className="text-lg font-bold text-black">
                            {user.handle.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-bold text-black">@{user.handle}</div>
                          <div className="text-sm text-gray-600">{formatTimeAgo(new Date(deletion.createdAt))}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-black mb-3">
                      Deleted {deletion.charCount} characters, {deletion.wordCount || 0} words and {deletion.sentenceCount || 0} sentences
                    </div>
                    
                    <div className="flex space-x-4 text-sm text-gray-600">
                      <span>💀 {deletion.charCount} chars</span>
                      <span>📝 {deletion.wordCount || 0} words</span>
                      <span>📄 {deletion.sentenceCount || 0} sentences</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}