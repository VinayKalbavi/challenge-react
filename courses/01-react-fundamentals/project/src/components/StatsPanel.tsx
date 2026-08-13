import type { Priority } from './TaskList'

export type TaskStats = {
  total: number
  completed: number
  completedPercentage: number
  active: number
  overdue: number
  categoryBreakdown: Record<string, number>
  priorityBreakdown: Record<Priority, number>
}

type StatsPanelProps = {
  total?: number
  completed?: number
  active?: number
  overdue?: number
  stats?: TaskStats
}

function StatsPanel({
  total,
  completed,
  active,
  overdue,
  stats,
}: StatsPanelProps) {
  const totalTasks = stats?.total ?? total ?? 0
  const completedTasks = stats?.completed ?? completed ?? 0
  const activeTasks = stats?.active ?? active ?? 0
  const overdueTasks = stats?.overdue ?? overdue ?? 0

  const completedPercentage =
    stats?.completedPercentage ??
    (totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100))

  const categoryBreakdown =
    stats?.categoryBreakdown ?? {}

  const priorityBreakdown =
    stats?.priorityBreakdown ?? {
      High: 0,
      Medium: 0,
      Low: 0,
    }

  return (
    <section id="stats-panel">
      <h2>Task Statistics</h2>

      <div id="stats-summary">
        <div>
          <h3>Total: {totalTasks}</h3>
          <p id="stats-total">{totalTasks}</p>
        </div>

        <div>
          <h3>Completed: {completedTasks}</h3>
          <p id="stats-completed">
            {completedTasks} ({completedPercentage}%)
          </p>
        </div>

        <div>
          <h3>Active: {activeTasks}</h3>
          <p id="stats-active">{activeTasks}</p>
        </div>

        <div>
          <h3>Overdue: {overdueTasks}</h3>
          <p id="stats-overdue">{overdueTasks}</p>
        </div>
      </div>

      <div id="completion-progress">
        <p>Completion Progress</p>

        <div
          role="progressbar"
          aria-label="Task completion progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={completedPercentage}
        >
          <div
            style={{
              width: `${completedPercentage}%`,
              height: '100%',
            }}
          />
        </div>
      </div>

      <div id="category-breakdown">
        <h3>Tasks by Category</h3>

        {Object.entries(categoryBreakdown).map(
          ([category, count]) => (
            <p key={category}>
              {category}: {count}
            </p>
          ),
        )}
      </div>

      <div id="priority-breakdown">
        <h3>Tasks by Priority</h3>

        <p>High: {priorityBreakdown.High}</p>
        <p>Medium: {priorityBreakdown.Medium}</p>
        <p>Low: {priorityBreakdown.Low}</p>
      </div>
    </section>
  )
}

export default StatsPanel