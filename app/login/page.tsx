'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Moon, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [preferredName, setPreferredName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | null, text: string }>({ type: null, text: '' })

  const supabase = createClient()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password || (mode === 'signup' && !preferredName)) {
      setMessage({ type: 'error', text: 'Please fill in all required fields.' })
      return
    }

    setLoading(true)
    setMessage({ type: null, text: '' })

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: preferredName
            }
          }
        })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
      }

      router.push('/')
      router.refresh()
      
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'An unexpected error occurred.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="p-3 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-xl shadow-lg shadow-cyan-500/20">
            <Moon className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          {mode === 'signin' ? 'Welcome back' : 'Create your Journal'}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          {mode === 'signin' ? 'Sign in to access your sleep data.' : 'Start analyzing and saving sleep hacks today.'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900 py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-slate-800">
          
          {/* Tabs */}
          <div className="flex p-1 bg-slate-950 rounded-xl mb-8">
            <button
              onClick={() => setMode('signin')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${mode === 'signin' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-300'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${mode === 'signup' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-300'}`}
            >
              Sign Up
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleAuth}>
            
            {mode === 'signup' && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300">
                  Preferred Name
                </label>
                <div className="mt-2">
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={preferredName}
                    onChange={(e) => setPreferredName(e.target.value)}
                    className="w-full h-12 bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-cyan-500"
                    placeholder="How should we call you?"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                Email address
              </label>
              <div className="mt-2">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-cyan-500"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                Password
              </label>
              <div className="relative mt-2">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-cyan-500 pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-cyan-500 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {message.text && (
              <div className={`p-4 rounded-xl text-sm font-medium border ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                {message.text}
              </div>
            )}

            <div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl transition-all disabled:opacity-50"
              >
                {loading ? 'Processing...' : (mode === 'signin' ? 'Sign In' : 'Create Account')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
