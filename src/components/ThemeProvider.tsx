'use client';

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
} from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  setTheme: () => {},
  toggleTheme: () => {},
});

const STORAGE_KEY = 'theme';

/**
 * The DOM is the source of truth for the current theme.
 *
 * An inline script in the root layout stamps `.dark` on `<html>` before React
 * hydrates (see `src/app/layout.tsx`), so reading the class back is both the
 * cheapest and the most accurate snapshot - no effect, no flash, no mismatch.
 */
function getThemeFromDom(): Theme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

/** Subscribers are notified through a DOM `class` mutation observer. */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });

  // Keep multiple tabs in sync when the user flips the theme in one of them.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    if (event.newValue === 'dark' || event.newValue === 'light') {
      applyTheme(event.newValue);
    }
  };
  window.addEventListener('storage', onStorage);

  return () => {
    observer.disconnect();
    window.removeEventListener('storage', onStorage);
  };
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  document.documentElement.style.colorScheme = theme;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore<Theme>(
    subscribe,
    getThemeFromDom,
    // Server snapshot - dark is the default theme (the root layout renders
    // `<html class="dark">`), so this matches what the client hydrates into.
    () => 'dark',
  );

  const setTheme = useCallback((next: Theme) => {
    applyTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private-mode or blocked storage - the class change still applies.
    }
  }, []);

  const toggleTheme = useCallback(
    () => setTheme(getThemeFromDom() === 'dark' ? 'light' : 'dark'),
    [setTheme],
  );

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
