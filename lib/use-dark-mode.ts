import useDarkModeImpl from '@fisch0920/use-dark-mode'

export function useDarkMode() {
  // Force light mode (false) - always start in light mode
  // Only initialize on client-side to avoid SSR localStorage errors
  if (typeof window !== 'undefined') {
    useDarkModeImpl(false, {
      classNameDark: 'dark-mode',
      storageKey: 'darkMode',
    })
  }

  return {
    isDarkMode: false, // Always return false to force light mode
    toggleDarkMode: () => {
      // Disable toggle - keep it always in light mode
    }
  }
}
