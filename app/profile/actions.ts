'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function logSleepAction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return { error: 'You must be logged in to log sleep.' }
  }

  const date = formData.get('date') as string
  const hoursSlept = parseFloat(formData.get('hoursSlept') as string)
  const quality = parseInt(formData.get('quality') as string)
  const notes = formData.get('notes') as string

  if (!date || isNaN(hoursSlept) || isNaN(quality)) {
    return { error: 'Invalid data provided.' }
  }

  const { error } = await supabase
    .from('sleep_logs')
    .insert([
      {
        user_id: user.id,
        date,
        hours_slept: hoursSlept,
        quality,
        notes: notes || null
      }
    ])

  if (error) {
    console.error('Error inserting sleep log:', error)
    return { error: `Database error: ${error.message}` }
  }

  revalidatePath('/profile')
  return { success: true }
}
