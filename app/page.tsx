'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { AnalysisCard } from '@/components/analysis-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

const QUICK_PRESETS = [
  'Mouth Taping',
  'Ashwagandha',
  'Military Sleep Method',
]

export default function Home() {
  const [searchInput, setSearchInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async (hackToAnalyze?: string) => {
    const hack = typeof hackToAnalyze === 'string' ? hackToAnalyze : searchInput
    if (!hack.trim()) return

    setSearchInput(hack)
    setLoading(true)
    setError(null)
    setResult(null)
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hack }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze hack')
      }
      setResult(data)
    } catch (err: any) {
      console.error('Failed to analyze hack:', err)
      setError(err.message || 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAnalyze()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Find sleep remedies you can actually trust.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            SleepHAX analyzes viral sleep hacks with clinical precision, separating fact from fiction.
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <div className="relative mb-6 flex gap-3">
            <div className="flex-1 relative">
              <Input
                placeholder="e.g., Mouth taping, Magnesium Glycinate, 10mg Melatonin..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full h-14 bg-secondary/30 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 text-base"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            </div>
            <Button
              onClick={() => handleAnalyze()}
              disabled={loading}
              size="lg"
              className="h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold whitespace-nowrap transition-all duration-200 disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : 'Analyze'}
            </Button>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap gap-3">
            <span className="text-sm text-muted-foreground self-center">Quick presets:</span>
            {QUICK_PRESETS.map((preset) => (
              <button
                key={preset}
                onClick={() => handleAnalyze(preset)}
                disabled={loading}
                className="px-4 py-2 rounded-full text-sm font-medium bg-secondary/40 text-foreground hover:bg-secondary/60 border border-border transition-all duration-200 hover:border-primary/50 disabled:opacity-50"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Analysis Card */}
        {result && (
          <AnalysisCard
            {...result}
            isVisible={!!result}
          />
        )}

        {/* Error State */}
        {error && (
          <div className="mt-16 text-center py-12 border border-red-500/50 rounded-2xl bg-red-500/10">
            <p className="text-lg text-red-500 font-medium">
              {error}
            </p>
          </div>
        )}

        {/* Empty State */}
        {!result && !loading && !error && (
          <div className="mt-16 text-center py-12 border border-dashed border-border rounded-2xl bg-secondary/10">
            <p className="text-lg text-muted-foreground">
              Search for a sleep hack or click a preset to get started.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
