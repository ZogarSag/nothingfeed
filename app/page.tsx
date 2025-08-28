'use client'

import { useState, useEffect, useMemo, useCallback, memo } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { formatDeletionSummary, analyzeText } from '@/lib/textAnalysis'

interface Deletion {
  id: string
  charCount: number
  wordCount: number
  sentenceCount: number
  imageCount: number
  linkCount: number
  createdAt: string
  author: {
    handle: string
    avatarUrl: string | null
  }
}

const formatTimeAgo = (date: Date) => {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'a few seconds ago'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  return `${Math.floor(diffInSeconds / 86400)} days ago`
}

// Memoized Feed Item Component
const FeedItem = memo(({ deletion }: { deletion: Deletion }) => {
  const timeAgo = useMemo(() => formatTimeAgo(new Date(deletion.createdAt)), [deletion.createdAt])
  
  return (
    <div className="flex justify-center">
      <Card className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[6px_6px_0px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-200 cursor-pointer w-full max-w-2xl">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 bg-gray-200 border-2 border-black shadow-[3px_3px_0px_0px_#000000] flex items-center justify-center overflow-hidden hover:shadow-[4px_4px_0px_0px_#000000] transition-shadow">
              {deletion.author.avatarUrl ? (
                <img 
                  src={deletion.author.avatarUrl} 
                  alt={deletion.author.handle}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-lg font-bold text-black">
                  {deletion.author.handle.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1">
              <span className="font-bold text-lg text-black">
                @{deletion.author.handle}
              </span>
              <p className="text-sm text-black font-medium">
                {timeAgo}
              </p>
            </div>
          </div>
          
          <p className="text-black font-medium">
            {formatDeletionSummary({
              charCount: deletion.charCount,
              wordCount: deletion.wordCount || 0,
              sentenceCount: deletion.sentenceCount || 0,
              imageCount: deletion.imageCount,
              linkCount: deletion.linkCount
            })}
          </p>
        </CardContent>
      </Card>
    </div>
  )
})

FeedItem.displayName = 'FeedItem'

export default function HomePage() {
  const [feed, setFeed] = useState<Deletion[]>([])
  const [user, setUser] = useState<any>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isFocused, setIsFocused] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in and fetch feed
    const fetchData = async () => {
      try {
        const [meResponse, feedResponse] = await Promise.all([
          fetch('/api/me'),
          fetch('/api/feed')
        ])

        if (meResponse.ok) {
          const meData = await meResponse.json()
          setIsLoggedIn(meData.isLoggedIn || false)
          setUser(meData.user || null)
        } else {
          setIsLoggedIn(false)
          setUser(null)
        }

        if (feedResponse.ok) {
          const feedData = await feedResponse.json()
          setFeed(feedData.items || [])
        } else {
          setFeed([])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        setIsLoggedIn(false)
        setFeed([])
      } finally {
        setIsInitialLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoggedIn || text.length === 0) return
    
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/compose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })

      const data = await response.json()

      if (response.ok) {
        setText('')
        // Refresh feed
        fetch('/api/feed')
          .then(res => res.json())
          .then(data => setFeed(data.items || []))
          .catch(() => {})
      } else {
        console.error('API error response:', data)
        setError(data.error || 'Post could not be created')
        if (data.details) {
          console.error('Error details:', data.details)
        }
      }
    } catch (error) {
      console.error('Network error:', error)
      setError('An error occurred')
    } finally {
      setIsLoading(false)
    }
  }, [isLoggedIn, text])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading && text.length > 0 && isLoggedIn) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }, [handleSubmit, isLoading, text.length, isLoggedIn])

  console.log('isLoggedIn:', isLoggedIn)

  if (isInitialLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-pulse">
                          <div className="text-2xl mb-4">🔄</div>
            <div className="text-lg font-bold text-black">
              Loading your Nothingfeed...
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {isLoggedIn && (
        <div className="flex justify-center">
          <Card className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[6px_6px_0px_0px_#000000] transition-shadow w-full max-w-2xl">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  maxLength={500}
                  rows={4}
                  className="bg-white border-2 border-black pr-16"
                  style={{
                    outline: 'none',
                    boxShadow: isFocused ? '4px 4px 0px 0px #000000' : '2px 2px 0px 0px #000000'
                  }}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="What's on your mind?"
                />
                <div className="absolute bottom-2 right-2 bg-white border border-black px-2 py-1 text-xs font-mono">
                  <span className="text-black font-bold">
                    {text.length}
                  </span>
                  <span className="text-black">/500</span>
                </div>
              </div>

              {error && (
                <Alert className="border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000000]">
                  <AlertDescription className="text-black">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={isLoading || text.length === 0}
                className={`w-full bg-white hover:bg-gray-50 disabled:cursor-not-allowed font-bold text-lg transition-all duration-200 hover:translate-x-[-1px] hover:translate-y-[-1px] ${
                  text.length === 0 
                    ? 'border-2 border-red-200 shadow-[4px_4px_0px_0px_#fecaca] hover:shadow-[6px_6px_0px_0px_#fecaca] disabled:opacity-50 text-red-200' 
                    : 'border-2 border-red-500 shadow-[4px_4px_0px_0px_#ef4444] hover:shadow-[6px_6px_0px_0px_#dc2626] text-red-500'
                }`}
                size="lg"
              >
                {isLoading ? (
                  <span className="text-sm">Deleting...</span>
                ) : (
                  '→'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        </div>
      )}

      <div className="space-y-4">
        {feed.length === 0 ? (
          <div className="flex justify-center">
            <Card className="w-full max-w-2xl text-center py-16 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000000]">
            <CardContent>
              <div className="text-6xl mb-4">💀</div>
              <h3 className="text-2xl font-bold text-black mb-2">Nothing deleted yet!</h3>
              <p className="text-black mb-6 max-w-md mx-auto">Nothing has been deleted yet. Start your first destruction and kill some characters, words, and sentences!</p>
            {!isLoggedIn && (
                <Button asChild variant="outline" className="bg-gray-100 text-black border-2 border-black shadow-[4px_4px_0px_0px_#000000] hover:bg-gray-200 hover:shadow-[6px_6px_0px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-200 font-bold">
                  <a href="/register">
                    Join the Chaos
                  </a>
                </Button>
              )}
            </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-4">
            {feed.map((deletion) => (
              <FeedItem key={deletion.id} deletion={deletion} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
