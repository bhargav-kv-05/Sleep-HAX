import Link from 'next/link'
import { Moon } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { UserMenu } from './user-menu'

export async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="border-b border-border bg-card sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-lg">
            <Moon className="w-6 h-6 text-background" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">SleepHAX</h1>
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm font-medium text-slate-300 hidden sm:inline-block">
                Hi, {user.user_metadata?.full_name || 'Sleep Hacker'}!
              </span>
              <UserMenu user={user} />
            </>
          ) : (
            <Link 
              href="/login" 
              className="px-4 py-1.5 text-sm bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg transition-colors shadow-sm"
            >
              Login / Journal
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
