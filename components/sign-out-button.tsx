'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { LogOut } from 'lucide-react'

export function SignOutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleSignOut = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    router.refresh()
    setLoading(false)
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className="flex items-center gap-2 px-3 py-1.5 text-sm border border-slate-800 hover:bg-slate-800 text-slate-300 font-medium rounded-lg transition-colors disabled:opacity-50"
    >
      <LogOut className="w-4 h-4" />
      {loading ? 'Signing out...' : 'Sign Out'}
    </button>
  )
}
