import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { Task } from './TaskList'
import FormInput from './FormInput'

export type StatusFilter =
  | 'all'
  | 'active'
  | 'completed'

export type SortOption =
  | 'default'
  | 'priority'
  | 'dueDate'

interface FilterBarProps {
  tasks?: Task[]
  onFilterChange?: (
    filteredTasks: Task[],
  ) => void
  onFilteredTasksChange?: (
    filteredTasks: Task[],
  ) => void
}

export default function FilterBar({
  tasks = [],
  onFilterChange,
  onFilteredTasksChange,
}: FilterBarProps) {
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>('all')

  const [categoryFilter, setCategoryFilter] =
    useState('all')

  const [search, setSearch] = useState('')

  const [sort, setSort] =
    useState<SortOption>('default')

  // Challenge 23: keep a reference to the search input DOM element.
  const searchInputRef =
    useRef<HTMLInputElement>(null)

  // Focus the search input only when FilterBar mounts.
  useEffect(() => {
    searchInputRef.current?.focus()
  }, [])

  const categories = useMemo(
    () =>
      [
        ...new Set(
          tasks
            .map((task) => task.category)
            .filter(Boolean),
        ),
      ] as string[],
    [tasks],
  )

  const filteredTasks = useMemo(() => {
    let result = [...tasks]

    if (statusFilter === 'active') {
      result = result.filter(
        (task) => !task.completed,
      )
    }

    if (statusFilter === 'completed') {
      result = result.filter(
        (task) => task.completed,
      )
    }

    if (categoryFilter !== 'all') {
      result = result.filter(
        (task) =>
          (task.category ?? 'General') ===
          categoryFilter,
      )
    }

    const searchValue = search
      .trim()
      .toLowerCase()

    if (searchValue) {
      result = result.filter((task) => {
        const title =
          task.title.toLowerCase()

        const description =
          task.description.toLowerCase()

        const category = (
          task.category ?? ''
        ).toLowerCase()

        const tags = (task.tags ?? [])
          .join(' ')
          .toLowerCase()

        return (
          title.includes(searchValue) ||
          description.includes(searchValue) ||
          category.includes(searchValue) ||
          tags.includes(searchValue)
        )
      })
    }

    if (sort === 'priority') {
      const priorityOrder = {
        High: 1,
        Medium: 2,
        Low: 3,
      }

      result.sort(
        (a, b) =>
          priorityOrder[a.priority] -
          priorityOrder[b.priority],
      )
    }

    if (sort === 'dueDate') {
      result.sort((a, b) => {
        if (!a.dueDate && !b.dueDate) {
          return 0
        }

        if (!a.dueDate) {
          return 1
        }

        if (!b.dueDate) {
          return -1
        }

        return (
          new Date(
            `${a.dueDate}T00:00:00`,
          ).getTime() -
          new Date(
            `${b.dueDate}T00:00:00`,
          ).getTime()
        )
      })
    }

    return result
  }, [
    tasks,
    statusFilter,
    categoryFilter,
    search,
    sort,
  ])

  useEffect(() => {
    onFilterChange?.(filteredTasks)
    onFilteredTasksChange?.(
      filteredTasks,
    )
  }, [
    filteredTasks,
    onFilterChange,
    onFilteredTasksChange,
  ])

  return (
    <div id="filter-bar">
      <FormInput
  label="Search"
  id="search-input"
  type="text"
  value={search}
  placeholder="Search tasks"
  inputRef={searchInputRef}
  onChange={(event) =>
    setSearch(event.target.value)
  }
/>

      <div>
        <label htmlFor="task-status-filter">
          Status
        </label>

        <select
          id="task-status-filter"
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value as StatusFilter,
            )
          }
        >
          <option value="all">All</option>
          <option value="active">
            Active
          </option>
          <option value="completed">
            Completed
          </option>
        </select>
      </div>

      <div>
        <label htmlFor="task-category-filter">
          Category
        </label>

        <select
          id="task-category-filter"
          value={categoryFilter}
          onChange={(event) =>
            setCategoryFilter(
              event.target.value,
            )
          }
        >
          <option value="all">
            All categories
          </option>

          {categories.map((category) => (
            <option
              key={category}
              value={category}
            >
              {category}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="task-sort">
          Sort
        </label>

        <select
          id="task-sort"
          value={sort}
          onChange={(event) =>
            setSort(
              event.target.value as SortOption,
            )
          }
        >
          <option value="default">
            Default
          </option>

          <option value="priority">
            Priority
          </option>

          <option value="dueDate">
            Due Date (Soonest First)
          </option>
        </select>
      </div>
    </div>
  )
}