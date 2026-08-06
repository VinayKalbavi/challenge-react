import { TaskCard } from "."

export interface Task {
  id: string | number
  title: string
  description: string
  priority: string
  completed: boolean
  category?: string
  tags?: string[]
  dueDate?: string | number
}

interface TaskListProps {
  tasks?: Task[]
  countText?: string
  onToggle?: (id: string | number) => void
  onDelete?: (id: string | number) => void
  linkToTaskDetail?: boolean
}

export default function TaskList(_props: TaskListProps) {
  const tasks: Task[] = [
    {
      id: 1,
      title: "Task One",
      description: "First hardcoded task",
      priority: "Priority: High",
      completed: false,
    },
    {
      id: 2,
      title: "Task Two",
      description: "Second hardcoded task",
      priority: "Priority: Medium",
      completed: false,
    },
    {
      id: 3,
      title: "Task Three",
      description: "Third hardcoded task",
      priority: "Priority: Low",
      completed: false,
    },
  ];

  return (
    <section id="task-list">
      {tasks.map((task) => (
        <TaskCard
        key={task.id}
        title={task.title}
        description={task.description}
        priority={task.priority}
        />
      ))}
    </section>
  )
}
