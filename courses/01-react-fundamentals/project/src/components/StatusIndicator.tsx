/**
 * Supported task status indicators.
 */
export type StatusType =
  | 'overdue'
  | 'due-today'
  | 'due-soon'
  | 'completed'

export interface StatusIndicatorProps {
  status: StatusType
}

function StatusIndicator({
  status,
}: StatusIndicatorProps) {
  const labels: Record<StatusType, string> = {
    overdue: 'Overdue',
    'due-today': 'Due Today',
    'due-soon': 'Due Soon',
    completed: 'Completed',
  }

  return (
    <span
      className={`status-indicator status-${status}`}
      data-status={status}
    >
      {labels[status]}
    </span>
  )
}

export default StatusIndicator