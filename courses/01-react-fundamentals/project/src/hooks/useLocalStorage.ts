import {
  useCallback,
  useState,
  type SetStateAction,
} from 'react'

export type UseLocalStorageSetter<T> = (
  value: SetStateAction<T>,
) => void

function readInitialValue<T>(
  storageKey: string,
  initialValue: T,
): T {
  if (typeof window === 'undefined') {
    return initialValue
  }

  try {
    const storedValue =
      window.localStorage.getItem(storageKey)

    if (storedValue === null) {
      return initialValue
    }

    return JSON.parse(storedValue) as T
  } catch {
    return initialValue
  }
}

/**
 * React state synchronized with localStorage.
 * Invalid stored JSON or storage failures fall back
 * safely without crashing the application.
 */
export default function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, UseLocalStorageSetter<T>] {
  const [value, setValue] = useState<T>(() =>
    readInitialValue(
      key,
      initialValue,
    ),
  )

  const setStoredValue = useCallback(
    (nextValue: SetStateAction<T>) => {
      setValue((previousValue) => {
        const resolvedValue =
          typeof nextValue === 'function'
            ? (
                nextValue as (
                  previousValue: T,
                ) => T
              )(previousValue)
            : nextValue

        try {
          const serializedValue =
            JSON.stringify(resolvedValue)

          window.localStorage.setItem(
            key,
            serializedValue,
          )
        } catch {
          // Keep the in-memory state if storage fails.
        }

        return resolvedValue
      })
    },
    [key],
  )

  return [value, setStoredValue]
}