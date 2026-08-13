import React from 'react'
import {
  Link,
} from 'react-router-dom'
import type { Priority } from './TaskList'
import Badge from './Badge'
import Button from './Button'
import StatusIndicator from './StatusIndicator'

interface TaskCardProps {
  id?: string | number
  title: string
  description: string
  priority: Priority
  completed?: boolean
  category?: string
  tags?: string[]
  dueDate?: string
  onToggle?: (id: string | number) => void
  onDelete?: (id: string | number) => void
  linkToTaskDetail?: boolean
}

function getDueDateStatus(
  dueDate: string | undefined,
  completed: boolean,
): 'overdue' | 'today' | 'soon' | null {
  if (!dueDate || completed) {
    return null
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const due = new Date(`${dueDate}T00:00:00`)
  due.setHours(0, 0, 0, 0)

  const differenceInDays =
    (due.getTime() - today.getTime()) /
    (1000 * 60 * 60 * 24)

  if (differenceInDays < 0) {
    return 'overdue'
  }

  if (differenceInDays === 0) {
    return 'today'
  }

  if (differenceInDays <= 3) {
    return 'soon'
  }

  return null
}

function formatDueDate(
  dueDate: string | undefined,
): string {
  if (!dueDate) {
    return ''
  }

  return new Date(
    `${dueDate}T00:00:00`,
  ).toLocaleDateString()
}

function TaskCard({
  id,
  title,
  description,
  priority,
  completed = false,
  category = 'General',
  tags = [],
  dueDate,
  onToggle,
  onDelete,
  linkToTaskDetail = false,
}: TaskCardProps) {
  const dueDateStatus = getDueDateStatus(
    dueDate,
    completed,
  )

  const titleContent =
    linkToTaskDetail &&
    id !== undefined ? (
      <Link
        to={`/challenge/21-react-router/task/${id}`}
      >
        {title}
      </Link>
    ) : (
      title
    )

  return (
    <article
      id="task-card"
      className={
        dueDateStatus === 'overdue'
          ? 'task-card overdue'
          : 'task-card'
      }
      data-overdue={
        dueDateStatus === 'overdue'
          ? 'true'
          : 'false'
      }
      data-completed={
        completed ? 'true' : 'false'
      }
    >
      <h3>{titleContent}</h3>

      <p>{description}</p>

      <p>
        Priority:{' '}
        <Badge variant="priority">
          {priority}
        </Badge>
      </p>

      <p id="task-category">
        Category:{' '}
        <Badge variant="category">
          {category}
        </Badge>
      </p>

      <div id="task-tags">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="tag"
          >
            {tag}
          </Badge>
        ))}
      </div>

      {dueDate && (
        <div
          id="task-due-date"
          data-overdue={
            dueDateStatus === 'overdue'
              ? 'true'
              : 'false'
          }
        >
          Due Date: {formatDueDate(dueDate)}

          {dueDateStatus === 'overdue' && (
            <StatusIndicator status="overdue" />
          )}

          {dueDateStatus === 'today' && (
            <StatusIndicator status="due-today" />
          )}

          {dueDateStatus === 'soon' && (
            <StatusIndicator status="due-soon" />
          )}
        </div>
      )}

      {completed && (
        <StatusIndicator status="completed" />
      )}

      {onToggle && id !== undefined && (
        <Button
          type="button"
          variant="primary"
          onClick={() => onToggle(id)}
        >
          {completed
            ? 'Mark Active'
            : 'Complete'}
        </Button>
      )}

      {onDelete && id !== undefined && (
        <Button
          type="button"
          variant="danger"
          onClick={() => onDelete(id)}
        >
          Delete
        </Button>
      )}
    </article>
  )
}

export default React.memo(TaskCard)