import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Header } from '@/components/header'
import ProfileClient from './profile-client'

export default async function ProfilePage({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  const supabase = await createClient()
  
  // 1. Verify Authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect('/login')
  }

  // 2. Fetch User's Sleep Logs (most recent first)
  const { data: sleepLogs, error: logsError } = await supabase
    .from('sleep_logs')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .limit(30)

  const initialName = user.user_metadata?.full_name || 'Sleep Hacker'

  const resolvedParams = await searchParams
  const hackParam = resolvedParams?.hack
  const initialHack = typeof hackParam === 'string' ? `Trying: ${hackParam}` : undefined

  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      <main className="px-4 sm:px-6 lg:px-8 pb-16">
        <ProfileClient 
          initialName={initialName} 
          sleepLogs={sleepLogs || []} 
          initialHack={initialHack}
        />
      </main>
    </div>
  )
}
