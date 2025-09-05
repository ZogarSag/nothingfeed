'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    handle: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_email: formData.email,
          user_password: formData.password,
          user_handle: formData.handle,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Registration successful, redirect to login
        router.push('/login?message=Registration successful! Please log in.')
      } else {
        setError(data.error || 'Registration failed')
      }
    } catch (error) {
      console.error('Registration error:', error)
      setError('An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fieldName = e.target.name === 'user_email' ? 'email' : 
                     e.target.name === 'user_password' ? 'password' : 
                     e.target.name === 'user_handle' ? 'handle' : e.target.name
    setFormData({
      ...formData,
      [fieldName]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-md w-full mx-auto">
        <Card className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000000]">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-black mb-6">Create Account</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off" data-form-type="other">
              <div>
                <label htmlFor="user_email" className="block text-sm font-bold text-black mb-1">
                  E-Mail
                </label>
                <input
                  id="user_email"
                  name="user_email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="off"
                  data-lpignore="true"
                  data-form-type="other"
                  className="w-full px-3 py-2 border-2 border-black focus:outline-none focus:shadow-[2px_2px_0px_0px_#000000]"
                />
              </div>

              <div>
                <label htmlFor="user_handle" className="block text-sm font-bold text-black mb-1">
                  Username
                </label>
                <input
                  id="user_handle"
                  name="user_handle"
                  type="text"
                  required
                  value={formData.handle}
                  onChange={handleChange}
                  autoComplete="off"
                  data-lpignore="true"
                  data-form-type="other"
                  className="w-full px-3 py-2 border-2 border-black focus:outline-none focus:shadow-[2px_2px_0px_0px_#000000]"
                />
              </div>

              <div>
                <label htmlFor="user_password" className="block text-sm font-bold text-black mb-1">
                  Password
                </label>
                <input
                  id="user_password"
                  name="user_password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  data-lpignore="true"
                  data-form-type="other"
                  className="w-full px-3 py-2 border-2 border-black focus:outline-none focus:shadow-[2px_2px_0px_0px_#000000]"
                />
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
                disabled={isLoading}
                className="w-full bg-black text-white border-2 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[6px_6px_0px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] disabled:opacity-50 font-bold text-lg transition-all duration-200"
                size="lg"
              >
                {isLoading ? 'Creating Account...' : 'Join'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-black">
                Already have an account?{' '}
                <Link href="/login" className="font-bold hover:underline">
                  Log in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}