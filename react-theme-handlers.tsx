"use client"
import {
  useState,
  useEffect,
  createContext,
  Dispatch,
  SetStateAction,
  useContext
} from "react"

const getSystemTheme = () => {
  let systemTheme = ""
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    systemTheme = "dark"
  } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    systemTheme = "light"
  }
  return systemTheme
}

interface ThemeContext {
  theme: string
  setTheme: Dispatch<SetStateAction<string>>
}
export const ThemeContext = createContext<ThemeContext | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

type ThemeProviderProps = {
  children?: React.ReactNode | React.ReactNode[]
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const [hasMounted, setHasMounted] = useState(false)
  const [theme, setTheme] = useState("")

  useEffect(() => {
    setHasMounted(true)

    function loadTheme() {
      const savedTheme = localStorage.getItem("theme") || undefined
      if (savedTheme === undefined) {
        setTheme(getSystemTheme())
      } else {
        setTheme(savedTheme)
      }
    }

    function addThemeClasses() {
      const root = document.documentElement

      if (theme === "dark") {
        root.classList.add("dark")
      } else {
        root.classList.remove("dark")
      }
    }

    function saveThemeToLocal() {
      localStorage.setItem("theme", theme)
    }

    if (theme === "") {
      loadTheme()
    }

    addThemeClasses()

    if (theme !== "") {
      saveThemeToLocal()
    }
  }, [theme])

  if (!hasMounted) {
    return null
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
