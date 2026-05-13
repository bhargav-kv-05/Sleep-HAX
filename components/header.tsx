import { Moon, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="border-b border-border bg-card sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-lg">
            <Moon className="w-6 h-6 text-background" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">SleepHAX</h1>
        </div>
        <Button 
          variant="outline" 
          className="border-border hover:bg-secondary/20 text-foreground hover:text-foreground"
        >
          Login / Journal
        </Button>
      </div>
    </header>
  )
}
