import TaskCard from './TaskCard'
import TaskForm from './TaskForm'

export type Priority = 'Low' | 'Medium' | 'High'

export type Task = {
  id: string | number
  title: string
  description: string
  priority: Priority
  completed: boolean
  category?: string
  tags?: string[]
  dueDate?: string
}

interface TaskListProps {
  tasks?: Task[]
  countText?: string
  showForm?: boolean
  setTasks?: React.Dispatch<
    React.SetStateAction<Task[]>
  >
  categories?: string[]
  onDelete?: (
    id: string | number,
  ) => void
  linkToTaskDetail?: boolean
  onToggle?: (
    id: string | number,
  ) => void
}

export default function TaskList({
  tasks = [],
  countText,
  showForm = true,
  setTasks,
  categories = [],
  onDelete,
  linkToTaskDetail = false,
  onToggle,
}: TaskListProps) {
  const handleAddTask = (newTask: Task) => {
    setTasks?.((previousTasks) => [
      ...previousTasks,
      newTask,
    ])
  }

  const handleToggle = (
    id: string | number,
  ) => {
    if (onToggle) {
      onToggle(id)
      return
    }

    setTasks?.((previousTasks) =>
      previousTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
            }
          : task,
      ),
    )
  }

  return (
    <section id="task-list">
      {countText && (
        <div id="task-count">
          {countText}
        </div>
      )}

      {showForm && setTasks && (
        <TaskForm
          onAddTask={handleAddTask}
          categories={categories}
        />
      )}

      <div>
        {tasks.map((task) => (
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
            onDelete={
              onDelete
                ? (id) => onDelete(id)
                : undefined
            }
            linkToTaskDetail={
              linkToTaskDetail
            }
          />
        ))}
      </div>
    </section>
  )
}