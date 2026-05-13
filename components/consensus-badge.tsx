interface ConsensusBadgeProps {
  status: 'mixed' | 'supported' | 'limited' | 'insufficient'
}

export function ConsensusBadge({ status }: ConsensusBadgeProps) {
  const config = {
    mixed: {
      bg: 'bg-amber-900/30',
      text: 'text-amber-300',
      label: 'Mixed Evidence',
    },
    supported: {
      bg: 'bg-emerald-900/30',
      text: 'text-emerald-300',
      label: 'Strongly Supported',
    },
    limited: {
      bg: 'bg-blue-900/30',
      text: 'text-blue-300',
      label: 'Limited Evidence',
    },
    insufficient: {
      bg: 'bg-slate-700/30',
      text: 'text-slate-300',
      label: 'Insufficient Data',
    },
  }

  const styles = config[status]

  return (
    <div className={`${styles.bg} ${styles.text} inline-flex items-center px-3 py-1 rounded-full text-sm font-medium`}>
      {styles.label}
    </div>
  )
}
