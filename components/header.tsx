import Link from 'next/link'
import { Moon } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { UserMenu } from './user-menu'

export async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="border-b border-border bg-card sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 grid grid-cols-3 items-center">
        {/* Left: Logo */}
        <div className="flex justify-start">
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="p-2 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-lg">
              <Moon className="w-6 h-6 text-background" />
            </div>
            <h1 className="text-2xl font-bold text-foreground hidden sm:block">SleepHAX</h1>
          </Link>
        </div>

        {/* Center: Navigation */}
        <nav className="flex justify-center items-center gap-8 text-sm font-medium">
          <Link href="/" className="text-slate-300 hover:text-cyan-400 transition-colors">
            Home
          </Link>
          <Link href="/profile" className="text-slate-300 hover:text-cyan-400 transition-colors">
            My Journal
          </Link>
        </nav>

        {/* Right: Auth & Profile */}
        <div className="flex justify-end items-center gap-4">
          {user ? (
            <>
              <span className="text-sm font-medium text-slate-300 hidden md:inline-block">
                Hi, {user.user_metadata?.full_name || 'Sleep Hacker'}!
              </span>
              <UserMenu user={user} />
            </>
          ) : (
            <Link 
              href="/login" 
              className="px-4 py-1.5 text-sm bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg transition-colors shadow-sm whitespace-nowrap"
            >
              Login / Journal
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
