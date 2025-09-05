'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  )
}

function LoginPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const msg = searchParams.get('message')
    if (msg) {
      setMessage(msg)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        // Login successful, redirect to home
        router.push('/')
        router.refresh() // Refresh to update session state
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fieldName = e.target.name === 'user_input' ? 'email' : 'password'
    setFormData({
      ...formData,
      [fieldName]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-black">
            NOTHINGFEED :I
          </Link>
          <p className="mt-2 text-black">Welcome back to the void.</p>
        </div>

        <Card className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000000]">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-black mb-6">Log In</h2>
            
            <form 
              onSubmit={handleSubmit} 
              className="space-y-4"
              autoComplete="off"
              data-form-type="other"
            >
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-black mb-1">
                  Email
                </label>
                <input
                  id="email"
                  name="user_input"
                  type="email"
                  autoComplete="off"
                  data-lpignore="true"
                  data-form-type="other"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border-2 border-black focus:outline-none focus:shadow-[2px_2px_0px_0px_#000000]"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-bold text-black mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="secret_code"
                  type="password"
                  autoComplete="off"
                  data-lpignore="true"
                  data-form-type="other"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border-2 border-black focus:outline-none focus:shadow-[2px_2px_0px_0px_#000000]"
                />
              </div>

              {message && (
                <Alert className="border-2 border-black bg-green-50 shadow-[2px_2px_0px_0px_#000000]">
                  <AlertDescription className="text-black">
                    {message}
                  </AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert className="border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000000]">
                  <AlertDescription className="text-black">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white border-2 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[6px_6px_0px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] disabled:opacity-50 font-bold text-lg transition-all duration-200"
                size="lg"
              >
                {isLoading ? 'Logging in...' : 'Enter the Void'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-black">
                Don't have an account?{' '}
                <Link href="/register" className="font-bold hover:underline">
                  Join now
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
