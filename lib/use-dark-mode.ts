import useDarkModeImpl from '@fisch0920/use-dark-mode'

export function useDarkMode() {
  // Force light mode (false) - always start in light mode
  // Initialize with a no-op localStorage implementation for SSR
  // The hook will work on client-side but won't error on server
  try {
    useDarkModeImpl(false, {
      classNameDark: 'dark-mode',
      storageKey: 'darkMode',
    })
  } catch {
    // Ignore SSR localStorage errors
  }

  return {
    isDarkMode: false, // Always return false to force light mode
    toggleDarkMode: () => {
      // Disable toggle - keep it always in light mode
    }
  }
}
