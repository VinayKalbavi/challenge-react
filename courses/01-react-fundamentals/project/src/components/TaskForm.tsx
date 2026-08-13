import { useEffect, useState } from 'react'
import type { Priority, Task } from './TaskList'
import Button from './Button'
import FormInput from './FormInput'

type TaskFormProps = {
  onAddTask: (task: Task) => void
  categories?: string[]
  taskToEdit?: Task | null
  onUpdateTask?: (task: Task) => void
  onCancelEdit?: () => void
}

const DEFAULT_CATEGORIES = [
  'General',
  'Work',
  'Personal',
]

function TaskForm({
  onAddTask,
  categories = [],
  taskToEdit = null,
  onUpdateTask,
  onCancelEdit,
}: TaskFormProps) {
  const availableCategories = Array.from(
    new Set([
      ...DEFAULT_CATEGORIES,
      ...categories,
    ]),
  )

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] =
    useState<Priority>('Medium')
  const [category, setCategory] =
    useState('General')
  const [tagsInput, setTagsInput] = useState('')
  const [dueDate, setDueDate] = useState('')

  useEffect(() => {
    if (!taskToEdit) {
      setTitle('')
      setDescription('')
      setPriority('Medium')
      setCategory('General')
      setTagsInput('')
      setDueDate('')
      return
    }

    setTitle(taskToEdit.title)
    setDescription(taskToEdit.description)
    setPriority(taskToEdit.priority)
    setCategory(
      taskToEdit.category ?? 'General',
    )
    setTagsInput(
      (taskToEdit.tags ?? []).join(', '),
    )
    setDueDate(taskToEdit.dueDate ?? '')
  }, [taskToEdit])

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setPriority('Medium')
    setCategory('General')
    setTagsInput('')
    setDueDate('')
  }

  const parseTags = (
    value: string,
  ): string[] => {
    return value
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
  }

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    const trimmedTitle = title.trim()

    if (!trimmedTitle) {
      return
    }

    const task: Task = {
      id: taskToEdit?.id ?? Date.now(),
      title: trimmedTitle,
      description: description.trim(),
      priority,
      completed:
        taskToEdit?.completed ?? false,
      category: category || 'General',
      tags: parseTags(tagsInput),
      ...(dueDate ? { dueDate } : {}),
    }

    if (taskToEdit && onUpdateTask) {
      onUpdateTask(task)
    } else {
      onAddTask(task)
    }

    resetForm()
    onCancelEdit?.()
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormInput
        label="Title"
        id="task-title"
        value={title}
        onChange={(event) =>
          setTitle(event.target.value)
        }
      />

      <FormInput
        label="Description"
        id="task-description"
        value={description}
        onChange={(event) =>
          setDescription(event.target.value)
        }
        multiline
      />

      <div>
        <label htmlFor="task-priority">
          Priority
        </label>

        <select
          id="task-priority"
          value={priority}
          onChange={(event) =>
            setPriority(
              event.target.value as Priority,
            )
          }
        >
          <option value="Low">Low</option>
          <option value="Medium">
            Medium
          </option>
          <option value="High">High</option>
        </select>
      </div>

      <div>
        <label htmlFor="task-category">
          Category
        </label>

        <select
          id="task-category"
          value={category}
          onChange={(event) =>
            setCategory(event.target.value)
          }
        >
          {availableCategories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <FormInput
        label="Tags"
        id="task-tags"
        value={tagsInput}
        placeholder="e.g. react, frontend, urgent"
        onChange={(event) =>
          setTagsInput(event.target.value)
        }
      />

      <FormInput
        label="Due Date"
        id="task-due-date"
        type="date"
        value={dueDate}
        onChange={(event) =>
          setDueDate(event.target.value)
        }
      />

      <Button type="submit" variant="primary">
        {taskToEdit
          ? 'Update Task'
          : 'Add Task'}
      </Button>

      {taskToEdit && onCancelEdit && (
        <Button
          type="button"
          variant="secondary"
          onClick={onCancelEdit}
        >
          Cancel
        </Button>
      )}
    </form>
  )
}

export default TaskForm