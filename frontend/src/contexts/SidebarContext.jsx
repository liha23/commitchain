import React, { createContext, useContext, useState, useEffect } from 'react'

const SidebarContext = createContext()

// Breakpoint for mobile/desktop
export const MOBILE_BREAKPOINT = 768

export function SidebarProvider({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  // Check screen size on mount and resize
  useEffect(() => {
    let timeoutId = null

    const handleResize = () => {
      // Debounce resize events to improve performance
      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      timeoutId = setTimeout(() => {
        // Auto-close sidebar on mobile screens
        if (window.innerWidth < MOBILE_BREAKPOINT) {
          setIsSidebarOpen(false)
        } else {
          setIsSidebarOpen(true)
        }
      }, 150)
    }

    // Set initial state
    handleResize()

    // Listen for resize events
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [])

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  const openSidebar = () => {
    setIsSidebarOpen(true)
  }

  const value = {
    isSidebarOpen,
    toggleSidebar,
    closeSidebar,
    openSidebar,
  }

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}
