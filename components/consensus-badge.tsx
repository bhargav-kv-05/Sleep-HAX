interface ConsensusBadgeProps {
  status: string
}

export function ConsensusBadge({ status }: ConsensusBadgeProps) {
  let bg = 'bg-slate-700/30'
  let text = 'text-slate-300'
  
  if (status === 'Strongly Supported') {
    bg = 'bg-emerald-900/30'
    text = 'text-emerald-300'
  } else if (status === 'Mixed Evidence') {
    bg = 'bg-amber-900/30'
    text = 'text-amber-300'
  } else if (status === 'Limited Evidence') {
    bg = 'bg-blue-900/30'
    text = 'text-blue-300'
  } else if (status === 'Anecdotal') {
    bg = 'bg-purple-900/30'
    text = 'text-purple-300'
  } else if (status === 'Potentially Unsafe') {
    bg = 'bg-red-900/30'
    text = 'text-red-300'
  }

  return (
    <div className={`${bg} ${text} inline-flex items-center px-3 py-1 rounded-full text-sm font-medium`}>
      {status}
    </div>
  )
}
