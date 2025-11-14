import useDarkModeImpl from '@fisch0920/use-dark-mode'

export function useDarkMode() {
  // Force light mode (false) - always start in light mode
  // We don't use the darkMode instance, but we initialize it to prevent errors
  useDarkModeImpl(false, { 
    classNameDark: 'dark-mode',
    storageKey: 'darkMode',
  })

  return {
    isDarkMode: false, // Always return false to force light mode
    toggleDarkMode: () => {
      // Disable toggle - keep it always in light mode
    }
  }
}
