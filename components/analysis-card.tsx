'use client'

import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ConsensusBadge } from '@/components/consensus-badge'
import { Bookmark, ArrowUp, MessageSquare } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface AnalysisCardProps {
  title: string
  badge: string
  safetyScore: number
  efficacyScore: number
  verdict: string
  sources?: string[]
  liveRedditThreads?: any[]
  isVisible: boolean
}

export function AnalysisCard({
  title,
  badge,
  safetyScore,
  efficacyScore,
  verdict,
  sources,
  liveRedditThreads,
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
        {/* Guaranteed Live Reddit Threads */}
        {liveRedditThreads && liveRedditThreads.length > 0 && (
          <div className="bg-secondary/20 rounded-xl p-4 border border-border mt-4">
            <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#FF4500]" />
              Live Reddit Discussions
            </h4>
            <ul className="space-y-3">
              {liveRedditThreads.map((thread: any, idx: number) => (
                <li key={idx}>
                  <a 
                    href={thread.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center min-w-[36px] bg-background/50 rounded px-1 py-1 border border-border/50">
                        <ArrowUp className="w-3 h-3 text-slate-400 group-hover:text-[#FF4500] transition-colors" />
                        <span className="text-[10px] font-bold text-slate-300 mt-0.5">
                          {thread.upvotes > 999 ? `${(thread.upvotes / 1000).toFixed(1)}k` : thread.upvotes}
                        </span>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-slate-200 group-hover:text-cyan-400 transition-colors line-clamp-2 leading-snug">
                          {thread.title}
                        </h5>
                        <p className="text-xs text-slate-500 mt-1 font-medium">
                          {thread.subreddit}
                        </p>
                      </div>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Live Search Sources */}
        {sources && sources.length > 0 && (
          <div className="bg-secondary/20 rounded-xl p-4 border border-border mt-4">
            <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
              Clinical & Verified Sources
            </h4>
            <ul className="space-y-2 mb-4">
              {sources.map((source, idx) => {
                let displayName = source
                let href = source

                // Handle Gemini outputting raw subreddit names like "r/sleep"
                if (source.startsWith('r/')) {
                  displayName = source
                  href = `https://www.reddit.com/${source}`
                } else {
                  href = source.startsWith('http') ? source : `https://${source}`
                  // Nicely format full URLs
                  try {
                    const url = new URL(href)
                    if (url.hostname.includes('reddit.com')) {
                      return null // Hide Reddit links from here since we have the dedicated live section above
                    } else {
                      displayName = url.hostname.replace('www.', '')
                    }
                  } catch(e) {} 
                }

                if (!displayName) return null;

                return (
                  <li key={idx} className="text-sm truncate">
                    <a 
                      href={href} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1.5 transition-colors"
                      title={href}
                    >
                      <Bookmark className="w-3 h-3 opacity-50 shrink-0" />
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
