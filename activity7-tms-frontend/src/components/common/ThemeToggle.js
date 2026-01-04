import React, { useMemo } from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from '../../hooks/useTheme';

const ThemeToggle = ({ size = 'md' }) => {
  const { theme, toggleTheme } = useTheme();

  const { icon, label, dimensions } = useMemo(() => {
    const dimensionsMap = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    };

    if (theme === 'dark') {
      return {
        icon: <FiSun className={`${dimensionsMap[size] ?? dimensionsMap.md}`} />,
        label: 'Switch to light mode',
        dimensions: dimensionsMap[size] ?? dimensionsMap.md,
      };
    }

    return {
      icon: <FiMoon className={`${dimensionsMap[size] ?? dimensionsMap.md}`} />,
      label: 'Switch to dark mode',
      dimensions: dimensionsMap[size] ?? dimensionsMap.md,
    };
  }, [theme, size]);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-full bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-white"
      aria-label={label}
    >
      {icon}
    </button>
  );
};

export default ThemeToggle;
