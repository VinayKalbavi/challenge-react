import {
  createContext,
  useContext,
  useEffect,
  type ReactNode,
} from 'react'
import useLocalStorage from '../hooks/useLocalStorage'

export type Theme = 'light' | 'dark'

export interface ThemeContextValue {
  theme: Theme
  setTheme: (
    theme: Theme | ((previousTheme: Theme) => Theme),
  ) => void
  toggleTheme: () => void
}

export const ThemeContext =
  createContext<ThemeContextValue | undefined>(
    undefined,
  )

const THEME_STORAGE_KEY = 'task-app-theme'

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({
  children,
}: ThemeProviderProps) {
  const [theme, setTheme] =
    useLocalStorage<Theme>(
      THEME_STORAGE_KEY,
      'light',
    )

  useEffect(() => {
    document.documentElement.dataset.theme =
      theme
  }, [theme])

  const toggleTheme = () => {
    setTheme((previousTheme) =>
      previousTheme === 'light'
        ? 'dark'
        : 'light',
    )
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error(
      'useTheme must be used within ThemeProvider',
    )
  }

  return context
}