import {
  useMemo,
} from 'react'
import {
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom'
import type { Task } from './TaskList'

const STORAGE_KEY = 'task-app-tasks'

function readTasks(): Task[] {
  try {
    const storedTasks =
      localStorage.getItem(STORAGE_KEY)

    if (!storedTasks) {
      return []
    }

    const parsedTasks: unknown =
      JSON.parse(storedTasks)

    if (!Array.isArray(parsedTasks)) {
      return []
    }

    return parsedTasks as Task[]
  } catch {
    return []
  }
}

export default function TaskDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const tasks = useMemo(
    () => readTasks(),
    [],
  )

  const task = useMemo(
    () =>
      tasks.find(
        (item) => String(item.id) === String(id),
      ),
    [tasks, id],
  )

  if (!task) {
    return (
      <section id="task-detail-page">
        <h1>Task Not Found</h1>

        <p>
          The requested task could not be found.
        </p>

        <button
          id="task-detail-back"
          type="button"
          onClick={() =>
            navigate(
              '/challenge/21-react-router',
            )
          }
        >
          Back to list
        </button>
      </section>
    )
  }

  return (
    <section id="task-detail-page">
      <button
        id="task-detail-back"
        type="button"
        onClick={() =>
          navigate(
            '/challenge/21-react-router',
          )
        }
      >
        Back to list
      </button>

      <h1>{task.title}</h1>

      <p>{task.description}</p>

      <p>
        Priority: {task.priority}
      </p>

      <p>
        Category:{' '}
        {task.category ?? 'General'}
      </p>

      <p>
        Status:{' '}
        {task.completed
          ? 'Completed'
          : 'Active'}
      </p>

      {task.tags &&
        task.tags.length > 0 && (
          <div>
            <h2>Tags</h2>

            {task.tags.map((tag) => (
              <span
                key={tag}
                data-tag={tag}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

      {task.dueDate && (
        <p>
          Due Date: {task.dueDate}
        </p>
      )}

      <Link to="/challenge/21-react-router">
        Back to list
      </Link>
    </section>
  )
}