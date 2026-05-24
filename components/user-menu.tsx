'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { LogOut, User, Bed } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function UserMenu({ user }: { user: any }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const fullName = user.user_metadata?.full_name || 'Sleep Hacker'
  const email = user.email || ''
  
  // Get initials for the avatar (e.g. "Bhargav Kv" -> "BK")
  const initials = fullName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  const handleSignOut = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    // Force a hard reload to clear all client-side React state (like search results)
    window.location.href = '/'
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <div className="h-10 w-10 rounded-full bg-cyan-900 border border-cyan-500/50 flex items-center justify-center text-cyan-400 font-bold text-sm hover:bg-cyan-800 transition-colors shadow-sm">
          {initials}
        </div>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56 bg-slate-900 border-slate-800 text-slate-200 mt-2">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-white">{fullName}</p>
            <p className="text-xs leading-none text-slate-400">{email}</p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="bg-slate-800" />
        
        <Link href="/profile" className="outline-none">
          <DropdownMenuItem className="cursor-pointer focus:bg-slate-800 focus:text-white transition-colors py-2.5">
            <User className="mr-2 h-4 w-4 text-cyan-500" />
            <span>Profile Settings</span>
          </DropdownMenuItem>
        </Link>
        
        <Link href="/profile" className="outline-none">
          <DropdownMenuItem className="cursor-pointer focus:bg-slate-800 focus:text-white transition-colors py-2.5">
            <Bed className="mr-2 h-4 w-4 text-emerald-500" />
            <span>Sleep Journal</span>
          </DropdownMenuItem>
        </Link>
        
        <DropdownMenuSeparator className="bg-slate-800" />
        
        <DropdownMenuItem 
          onClick={handleSignOut}
          disabled={loading}
          className="cursor-pointer focus:bg-red-500/10 focus:text-red-400 text-red-400 transition-colors py-2.5"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{loading ? 'Signing out...' : 'Log out'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
