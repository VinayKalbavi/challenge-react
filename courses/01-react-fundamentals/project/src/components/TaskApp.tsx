import {
  useCallback,
  useMemo,
  useState,
} from 'react'
import TaskForm from './TaskForm'
import TaskCard from './TaskCard'
import FilterBar from './FilterBar'
import StatsPanel from './StatsPanel'
import Button from './Button'
import ErrorBoundary from './ErrorBoundary'
import { useTheme } from '../contexts/ThemeContext'
import type { Priority, Task } from './TaskList'
import type { TaskStats } from './StatsPanel'
import {
  ADD_TASK,
  DELETE_TASK,
  TOGGLE_TASK,
  type TaskAction,
} from '../reducers/taskReducer'

interface TaskAppProps {
  tasks: Task[]
  dispatch: React.Dispatch<TaskAction>
  showForm?: boolean
  showFilterBar?: boolean
  countFormat?: 'tasks' | 'completed'
  onDelete?: (id: string | number) => void
  linkToTaskDetail?: boolean
  showStatsPanel?: boolean
}

export default function TaskApp({
  tasks,
  dispatch,
  showForm = false,
  showFilterBar = false,
  countFormat = 'tasks',
  onDelete,
  linkToTaskDetail = false,
  showStatsPanel = false,
}: TaskAppProps) {
  const [filteredTasks, setFilteredTasks] =
    useState<Task[]>(tasks)

  const { theme, toggleTheme } = useTheme()

  const handleAddTask = useCallback(
    (task: Task) => {
      dispatch({
        type: ADD_TASK,
        payload: {
          ...task,
          category:
            task.category ?? 'General',
          tags: task.tags ?? [],
        },
      })
    },
    [dispatch],
  )

  const handleToggle = useCallback(
    (id: string | number) => {
      dispatch({
        type: TOGGLE_TASK,
        payload: id,
      })
    },
    [dispatch],
  )

  const handleDelete = useCallback(
    (id: string | number) => {
      if (onDelete) {
        onDelete(id)
        return
      }

      if (window.confirm('Are you sure?')) {
        dispatch({
          type: DELETE_TASK,
          payload: id,
        })
      }
    },
    [dispatch, onDelete],
  )

  const handleFilterChange = useCallback(
    (nextTasks: Task[]) => {
      setFilteredTasks(nextTasks)
    },
    [],
  )

  const stats = useMemo<TaskStats>(() => {
    const total = tasks.length

    const completed = tasks.filter(
      (task) => task.completed,
    ).length

    const active = tasks.filter(
      (task) => !task.completed,
    ).length

    const currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)

    const overdue = tasks.filter((task) => {
      if (task.completed || !task.dueDate) {
        return false
      }

      const dueDate = new Date(
        `${task.dueDate}T00:00:00`,
      )

      dueDate.setHours(0, 0, 0, 0)

      return (
        dueDate.getTime() <
        currentDate.getTime()
      )
    }).length

    const completedPercentage =
      total === 0
        ? 0
        : Math.round(
            (completed / total) * 100,
          )

    const categoryBreakdown: Record<
      string,
      number
    > = {}

    tasks.forEach((task) => {
      const category =
        task.category ?? 'General'

      categoryBreakdown[category] =
        (categoryBreakdown[category] ?? 0) + 1
    })

    const priorityBreakdown: Record<
      Priority,
      number
    > = {
      High: 0,
      Medium: 0,
      Low: 0,
    }

    tasks.forEach((task) => {
      priorityBreakdown[task.priority] += 1
    })

    return {
      total,
      completed,
      completedPercentage,
      active,
      overdue,
      categoryBreakdown,
      priorityBreakdown,
    }
  }, [tasks])

  const displayedTasks = useMemo(
    () =>
      showFilterBar
        ? filteredTasks
        : tasks,
    [showFilterBar, filteredTasks, tasks],
  )

  const count =
    countFormat === 'completed'
      ? tasks.filter(
          (task) => task.completed,
        ).length
      : tasks.length

  const countText =
    countFormat === 'completed'
      ? `${count} Completed`
      : `${count} Tasks`

  return (
    <section id="task-app">
      <header id="task-header">
        <h1>Task Manager</h1>

        <Button
          id="theme-toggle"
          type="button"
          variant="secondary"
          onClick={toggleTheme}
        >
          {theme === 'light'
            ? 'Dark Mode'
            : 'Light Mode'}
        </Button>
      </header>

      <div id="task-count">
        {countText}
      </div>

      {showForm && (
        <TaskForm
          onAddTask={handleAddTask}
        />
      )}

      {showFilterBar && (
        <FilterBar
          tasks={tasks}
          onFilterChange={handleFilterChange}
        />
      )}

      {showStatsPanel && (
        <StatsPanel stats={stats} />
      )}

      <ErrorBoundary>
        <section id="task-list">
          {displayedTasks.map((task) => (
            <TaskCard
              key={task.id}
              id={task.id}
              title={task.title}
              description={task.description}
              priority={task.priority}
              completed={task.completed}
              category={
                task.category ?? 'General'
              }
              tags={task.tags ?? []}
              dueDate={task.dueDate}
              onToggle={handleToggle}
              onDelete={handleDelete}
              linkToTaskDetail={
                linkToTaskDetail
              }
            />
          ))}
        </section>
      </ErrorBoundary>
    </section>
  )
}