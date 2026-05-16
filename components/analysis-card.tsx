'use client'

import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ConsensusBadge } from '@/components/consensus-badge'
import { Bookmark } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface AnalysisCardProps {
  title: string
  badge: string
  safetyScore: number
  efficacyScore: number
  verdict: string
  sources?: string[]
  isVisible: boolean
}

export function AnalysisCard({
  title,
  badge,
  safetyScore,
  efficacyScore,
  verdict,
  sources,
  isVisible,
}: AnalysisCardProps) {
  const router = useRouter()

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
        <p className="text-muted-foreground leading-relaxed text-base mb-6">
          {verdict}
        </p>

        {/* Live Search Sources */}
        {sources && sources.length > 0 && (
          <div className="bg-secondary/20 rounded-xl p-4 border border-border">
            <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
              Live Search Sources
            </h4>
            <ul className="space-y-2">
              {sources.map((source, idx) => {
                // Quick heuristic to format Reddit links nicer
                let displayName = source
                try {
                  const url = new URL(source)
                  if (url.hostname.includes('reddit.com')) {
                    const parts = url.pathname.split('/')
                    const subredditIndex = parts.indexOf('r')
                    if (subredditIndex !== -1 && parts.length > subredditIndex + 1) {
                      displayName = `r/${parts[subredditIndex + 1]}`
                    } else {
                      displayName = 'Reddit'
                    }
                  } else {
                    displayName = url.hostname.replace('www.', '')
                  }
                } catch(e) {} // Ignore invalid URLs

                return (
                  <li key={idx} className="text-sm">
                    <a 
                      href={source.startsWith('http') ? source : `https://${source}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1.5 transition-colors"
                    >
                      <Bookmark className="w-3 h-3 opacity-50" />
                      {displayName}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>

      {/* Save Button */}
      <Button
        size="lg"
        onClick={() => router.push(`/profile?hack=${encodeURIComponent(title)}`)}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 flex items-center justify-center gap-2 transition-all duration-200"
      >
        <Bookmark className="w-5 h-5" />
        Save to Journal
      </Button>
    </div>
  )
}
