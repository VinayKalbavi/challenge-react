import { useEffect, useState } from 'react'

interface TodoItem {
  id: number
  title: string
}

export default function FetchDemoView() {
  const [items, setItems] = useState<TodoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(
    null,
  )

  useEffect(() => {
    const controller = new AbortController()

    async function fetchTodos() {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(
          '/api/todos.json',
          {
            signal: controller.signal,
          },
        )

        if (!response.ok) {
          throw new Error(
            `Request failed with status ${response.status}`,
          )
        }

        const data: unknown = await response.json()

        if (!Array.isArray(data)) {
          throw new Error(
            'Invalid response data',
          )
        }

        const todos: TodoItem[] = data.filter(
          (item): item is TodoItem =>
            typeof item === 'object' &&
            item !== null &&
            'id' in item &&
            'title' in item &&
            typeof item.id === 'number' &&
            typeof item.title === 'string',
        )

        setItems(todos)
      } catch (requestError) {
        if (
          requestError instanceof DOMException &&
          requestError.name === 'AbortError'
        ) {
          return
        }

        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Failed to load data',
        )
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    void fetchTodos()

    return () => {
      controller.abort()
    }
  }, [])

  if (loading) {
    return (
      <section>
        <div id="fetch-loading">
          Loading...
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section>
        <div id="fetch-error">
          {error}
        </div>
      </section>
    )
  }

  return (
    <section>
      <ul id="fetch-list">
        {items.map((item) => (
          <li key={item.id}>
            {item.title}
          </li>
        ))}
      </ul>
    </section>
  )
}