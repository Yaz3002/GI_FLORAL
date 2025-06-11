import { useState, useEffect } from 'react';

export type Theme = 'light' | 'dark' | 'system';
export type Density = 'comfortable' | 'compact';

interface ThemeSettings {
  theme: Theme;
  density: Density;
  systemTheme: 'light' | 'dark';
}

export const useTheme = () => {
  const [settings, setSettings] = useState<ThemeSettings>({
    theme: 'light',
    density: 'comfortable',
    systemTheme: 'light'
  });

  // Detect system theme preference
  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  };

  // Apply theme to document
  const applyTheme = (theme: Theme, systemTheme: 'light' | 'dark') => {
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    
    // Apply new theme
    if (theme === 'system') {
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  };

  // Apply density to document
  const applyDensity = (density: Density) => {
    const body = document.body;
    
    // Remove existing density classes
    body.classList.remove('density-comfortable', 'density-compact');
    
    // Apply new density
    body.classList.add(`density-${density}`);
    body.dataset.density = density;
  };

  // Load saved settings on mount
  useEffect(() => {
    const savedTheme = (localStorage.getItem('theme') as Theme) || 'light';
    const savedDensity = (localStorage.getItem('density') as Density) || 'comfortable';
    const systemTheme = getSystemTheme();

    setSettings({
      theme: savedTheme,
      density: savedDensity,
      systemTheme
    });

    applyTheme(savedTheme, systemTheme);
    applyDensity(savedDensity);
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e: MediaQueryListEvent) => {
        const newSystemTheme = e.matches ? 'dark' : 'light';
        setSettings(prev => {
          const newSettings = { ...prev, systemTheme: newSystemTheme };
          if (prev.theme === 'system') {
            applyTheme('system', newSystemTheme);
          }
          return newSettings;
        });
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem('theme', newTheme);
    setSettings(prev => {
      const newSettings = { ...prev, theme: newTheme };
      applyTheme(newTheme, prev.systemTheme);
      return newSettings;
    });
  };

  const setDensity = (newDensity: Density) => {
    localStorage.setItem('density', newDensity);
    setSettings(prev => {
      const newSettings = { ...prev, density: newDensity };
      applyDensity(newDensity);
      return newSettings;
    });
  };

  const getCurrentTheme = (): 'light' | 'dark' => {
    return settings.theme === 'system' ? settings.systemTheme : settings.theme;
  };

  return {
    theme: settings.theme,
    density: settings.density,
    systemTheme: settings.systemTheme,
    currentTheme: getCurrentTheme(),
    setTheme,
    setDensity
  };
};