import useDarkModeImpl from '@fisch0920/use-dark-mode'

export function useDarkMode() {
  // Force light mode (false) - always start in light mode
  const darkMode = useDarkModeImpl(false, { 
    classNameDark: 'dark-mode',
    storageKey: 'darkMode',
    // Disable localStorage persistence to always default to light mode
    // Users can still toggle, but it won't persist
  })

  return {
    isDarkMode: false, // Always return false to force light mode
    toggleDarkMode: () => {
      // Disable toggle - keep it always in light mode
      // darkMode.toggle()
    }
  }
}
