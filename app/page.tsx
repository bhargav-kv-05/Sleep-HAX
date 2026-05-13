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

const MOCK_ANALYSES = {
  'mouth taping': {
    hack: 'Mouth Taping',
    consensus: 'mixed' as const,
    safetyScore: 7,
    efficacyScore: 5,
    verdict:
      'Mouth taping shows promise for improving sleep quality and reducing snoring by promoting nasal breathing. However, clinical evidence is limited, and it carries potential risks for individuals with sleep apnea or respiratory conditions. Always consult a healthcare provider before trying this technique, especially if you have underlying breathing disorders.',
  },
  'ashwagandha': {
    hack: 'Ashwagandha',
    consensus: 'supported' as const,
    safetyScore: 8,
    efficacyScore: 7,
    verdict:
      'Ashwagandha has strong clinical support for reducing anxiety and improving sleep quality. Multiple peer-reviewed studies show it can lower cortisol levels and improve sleep latency. It&apos;s generally well-tolerated with minimal side effects, making it one of the most evidence-backed natural sleep aids available.',
  },
  'military sleep method': {
    hack: 'Military Sleep Method',
    consensus: 'limited' as const,
    safetyScore: 9,
    efficacyScore: 6,
    verdict:
      'The military sleep technique (also called the "4-7-8" method) is a relaxation technique with limited but promising research. It&apos;s completely safe and involves controlled breathing patterns. While not universally effective, many users report faster sleep onset when practiced consistently. Best used as part of a broader sleep hygiene routine.',
  },
}

export default function Home() {
  const [searchInput, setSearchInput] = useState('')
  const [currentAnalysis, setCurrentAnalysis] = useState<string | null>(null)

  const handleSearch = () => {
    const normalized = searchInput.toLowerCase().trim()
    if (MOCK_ANALYSES[normalized as keyof typeof MOCK_ANALYSES]) {
      setCurrentAnalysis(normalized)
    }
  }

  const handlePreset = (preset: string) => {
    const normalized = preset.toLowerCase()
    setSearchInput(preset)
    setCurrentAnalysis(normalized)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const activeAnalysis = currentAnalysis
    ? MOCK_ANALYSES[currentAnalysis as keyof typeof MOCK_ANALYSES]
    : null

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
              onClick={handleSearch}
              size="lg"
              className="h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold whitespace-nowrap transition-all duration-200"
            >
              Analyze
            </Button>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap gap-3">
            <span className="text-sm text-muted-foreground self-center">Quick presets:</span>
            {QUICK_PRESETS.map((preset) => (
              <button
                key={preset}
                onClick={() => handlePreset(preset)}
                className="px-4 py-2 rounded-full text-sm font-medium bg-secondary/40 text-foreground hover:bg-secondary/60 border border-border transition-all duration-200 hover:border-primary/50"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Analysis Card */}
        {activeAnalysis && (
          <AnalysisCard
            {...activeAnalysis}
            isVisible={!!activeAnalysis}
          />
        )}

        {/* Empty State */}
        {!activeAnalysis && (
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
