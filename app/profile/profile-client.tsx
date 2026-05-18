'use client'

import { useState } from 'react'
import { logSleepAction } from './actions'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff, CheckCircle2, Lock, Bed, History, AlertCircle, Sparkles } from 'lucide-react'

// Pass down user metadata and sleep logs
export default function ProfileClient({ 
  initialName, 
  sleepLogs,
  initialHack
}: { 
  initialName: string, 
  sleepLogs: any[],
  initialHack?: string
}) {
  const [activeTab, setActiveTab] = useState<'journal' | 'settings'>('journal')
  
  // Settings State
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [settingsLoading, setSettingsLoading] = useState(false)
  const [settingsMessage, setSettingsMessage] = useState<{type: 'success'|'error', text: string} | null>(null)
  
  // Journal State
  const [logLoading, setLogLoading] = useState(false)
  const [logMessage, setLogMessage] = useState<{type: 'success'|'error', text: string} | null>(null)

  // AI Insights State
  const [insightsLoading, setInsightsLoading] = useState(false)
  const [insights, setInsights] = useState<{ praise: string, analysis: string, recommendation: string } | null>(null)
  const [insightsError, setInsightsError] = useState('')

  const supabase = createClient()

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password) return

    setSettingsLoading(true)
    setSettingsMessage(null)

    const { error } = await supabase.auth.updateUser({ password })
    
    if (error) {
      setSettingsMessage({ type: 'error', text: error.message })
    } else {
      setSettingsMessage({ type: 'success', text: 'Password successfully updated!' })
      setPassword('')
    }
    setSettingsLoading(false)
  }

  const handleLogSleep = async (formData: FormData) => {
    setLogLoading(true)
    setLogMessage(null)

    const result = await logSleepAction(formData)
    
    if (result.error) {
      setLogMessage({ type: 'error', text: result.error })
    } else {
      setLogMessage({ type: 'success', text: 'Sleep logged successfully!' })
      // Reset form
      const form = document.getElementById('sleep-log-form') as HTMLFormElement
      if (form) form.reset()
    }
    setLogLoading(false)
  }

  const handleGenerateInsights = async () => {
    if (sleepLogs.length === 0) return;
    setInsightsLoading(true)
    setInsightsError('')
    try {
      const res = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sleepLogs })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setInsights(data)
    } catch (error: any) {
      setInsightsError(error.message || 'An error occurred.')
    } finally {
      setInsightsLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto mt-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
      
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 bg-slate-950/50 p-6 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col gap-2">
        <div className="mb-6 px-2">
          <h2 className="text-xl font-bold text-white">{initialName}</h2>
          <p className="text-sm text-slate-400">Sleep Profile</p>
        </div>

        <button
          onClick={() => setActiveTab('journal')}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'journal' 
              ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/20' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
          }`}
        >
          <Bed className="w-5 h-5" />
          Sleep Journal
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'settings' 
              ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/20' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
          }`}
        >
          <Lock className="w-5 h-5" />
          Account Settings
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 md:p-10">
        
        {/* ================= SLEEP JOURNAL TAB ================= */}
        {activeTab === 'journal' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Log Your Sleep</h3>
              <p className="text-slate-400 text-sm">
                Track your sleep to unlock personalized insights. This data is private and only visible to you.
              </p>
            </div>

            <form id="sleep-log-form" action={handleLogSleep} className="bg-slate-950/50 border border-slate-800 p-6 rounded-xl space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Date</label>
                  <Input type="date" name="date" required className="bg-slate-900 border-slate-800 h-12" defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Hours Slept</label>
                  <Input type="number" step="0.5" min="0" max="24" name="hoursSlept" required placeholder="e.g. 7.5" className="bg-slate-900 border-slate-800 h-12" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Sleep Quality (1 - Poor, 5 - Excellent)</label>
                <div className="flex gap-4">
                  {[1, 2, 3, 4, 5].map(num => (
                    <label key={num} className="flex-1 cursor-pointer">
                      <input type="radio" name="quality" value={num} required className="peer sr-only" />
                      <div className="h-12 flex items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 peer-checked:bg-cyan-600/20 peer-checked:border-cyan-500 peer-checked:text-cyan-400 transition-all font-medium">
                        {num}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Notes (Optional)</label>
                <textarea 
                  name="notes" 
                  defaultValue={initialHack}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 min-h-[100px]"
                  placeholder="Tried mouth taping? Drank chamomile tea? Log it here."
                />
              </div>

              {logMessage && (
                <div className={`p-4 rounded-xl text-sm font-medium border flex items-center gap-2 ${logMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                  {logMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  {logMessage.text}
                </div>
              )}

              <Button type="submit" disabled={logLoading} className="w-full h-12 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl">
                {logLoading ? 'Saving...' : 'Save Sleep Log'}
              </Button>
            </form>

            {/* AI Insights Section */}
            {sleepLogs.length > 0 && (
              <div className="pt-8 pb-4 border-b border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-1">
                      <Sparkles className="w-5 h-5 text-cyan-400" /> AI Sleep Insights
                    </h3>
                    <p className="text-sm text-slate-400">Discover patterns hidden in your journal.</p>
                  </div>
                  <Button 
                    onClick={handleGenerateInsights}
                    disabled={insightsLoading}
                    className="bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 w-full sm:w-auto h-11"
                  >
                    {insightsLoading ? 'Analyzing...' : insights ? 'Refresh Insights' : 'Generate Insights'}
                  </Button>
                </div>

                {insightsError && (
                  <div className="p-4 mb-6 rounded-xl text-sm font-medium border bg-red-500/10 text-red-400 border-red-500/20">
                    {insightsError}
                  </div>
                )}

                {insights && (
                  <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-cyan-500/30 p-6 sm:p-8 rounded-2xl shadow-lg relative overflow-hidden mb-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>
                    
                    {insights.praise && (
                      <div className="mb-6 inline-block bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full text-sm font-semibold">
                        ✨ {insights.praise}
                      </div>
                    )}
                    
                    <h4 className="text-lg font-semibold text-white mb-2">Pattern Analysis</h4>
                    <p className="text-slate-300 text-base leading-relaxed mb-8">
                      {insights.analysis}
                    </p>
                    
                    <h4 className="text-lg font-semibold text-white mb-3">Recommendation</h4>
                    <div className="bg-cyan-500/10 border border-cyan-500/20 p-5 rounded-xl">
                      <p className="text-cyan-300 text-base font-medium leading-relaxed">
                        {insights.recommendation}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="pt-2">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <History className="w-5 h-5 text-cyan-400" /> Recent History
              </h3>
              
              {sleepLogs.length === 0 ? (
                <div className="text-center py-10 bg-slate-950/30 rounded-xl border border-dashed border-slate-800">
                  <p className="text-slate-500">No sleep logs yet. Start tracking tonight!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sleepLogs.map(log => (
                    <div key={log.id} className="bg-slate-950/50 border border-slate-800 p-4 rounded-xl flex items-center justify-between hover:border-slate-700 transition-colors">
                      <div>
                        <p className="text-white font-medium">{new Date(log.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                        <p className="text-sm text-slate-400">{log.hours_slept} hours • Quality: {log.quality}/5</p>
                        {log.notes && <p className="text-sm text-slate-500 mt-1 italic">"{log.notes}"</p>}
                      </div>
                      <div className="h-10 w-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 font-bold">
                        {log.quality}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= SETTINGS TAB ================= */}
        {activeTab === 'settings' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Account Settings</h3>
              <p className="text-slate-400 text-sm">Manage your security and preferences.</p>
            </div>

            <div className="bg-slate-950/50 border border-slate-800 p-6 rounded-xl space-y-6">
              <h4 className="text-lg font-medium text-white border-b border-slate-800 pb-2">Change Password</h4>
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">New Password</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="bg-slate-900 border-slate-800 text-white placeholder-slate-500 h-12 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-cyan-500"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {settingsMessage && (
                  <div className={`p-4 rounded-xl text-sm font-medium border flex items-center gap-2 ${settingsMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                    {settingsMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    {settingsMessage.text}
                  </div>
                )}

                <Button type="submit" disabled={settingsLoading} className="h-12 bg-slate-800 hover:bg-slate-700 text-white w-full sm:w-auto px-8">
                  {settingsLoading ? 'Updating...' : 'Update Password'}
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
