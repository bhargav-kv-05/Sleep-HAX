'use client'

import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ConsensusBadge } from '@/components/consensus-badge'
import { Bookmark } from 'lucide-react'

interface AnalysisCardProps {
  title: string
  badge: string
  safetyScore: number
  efficacyScore: number
  verdict: string
  isVisible: boolean
}

export function AnalysisCard({
  title,
  badge,
  safetyScore,
  efficacyScore,
  verdict,
  isVisible,
}: AnalysisCardProps) {
  if (!isVisible) return null

  const getSafetyColor = (score: number) => {
    if (score >= 8) return 'bg-emerald-500'
    if (score >= 6) return 'bg-cyan-500'
    if (score >= 4) return 'bg-amber-500'
    return 'bg-red-500'
  }

  const getEfficacyColor = (score: number) => {
    if (score >= 8) return 'bg-emerald-500'
    if (score >= 6) return 'bg-cyan-500'
    if (score >= 4) return 'bg-amber-500'
    return 'bg-red-500'
  }

  return (
    <div className="mt-8 bg-card border border-border rounded-2xl p-8 shadow-2xl">
      {/* Badge */}
      <div className="flex justify-between items-start mb-6">
        <div />
        <ConsensusBadge status={badge} />
      </div>

      {/* Title */}
      <h2 className="text-3xl font-bold text-foreground mb-8">{title}</h2>

      {/* Metrics Section */}
      <div className="space-y-8 mb-8">
        {/* Clinical Safety Score */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-lg font-semibold text-foreground">
              Clinical Safety Score
            </label>
            <span className="text-2xl font-bold text-cyan-400">{safetyScore}/10</span>
          </div>
          <div className="bg-secondary/30 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full ${getSafetyColor(safetyScore)} transition-all duration-300`}
              style={{ width: `${safetyScore * 10}%` }}
            />
          </div>
        </div>

        {/* Efficacy Score */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-lg font-semibold text-foreground">
              Efficacy Score
            </label>
            <span className="text-2xl font-bold text-cyan-400">{efficacyScore}/10</span>
          </div>
          <div className="bg-secondary/30 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full ${getEfficacyColor(efficacyScore)} transition-all duration-300`}
              style={{ width: `${efficacyScore * 10}%` }}
            />
          </div>
        </div>
      </div>

      {/* Verdict Section */}
      <div className="mb-8 pb-8 border-b border-border">
        <h3 className="text-xl font-semibold text-foreground mb-4">The Verdict</h3>
        <p className="text-muted-foreground leading-relaxed text-base">
          {verdict}
        </p>
      </div>

      {/* Save Button */}
      <Button
        size="lg"
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 flex items-center justify-center gap-2 transition-all duration-200"
      >
        <Bookmark className="w-5 h-5" />
        Save to Journal
      </Button>
    </div>
  )
}
