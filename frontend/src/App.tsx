import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTheme } from './store/themeStore';
import { useEffect } from 'react';

function App() {
  const { theme } = useTheme();

  // Root Theme Interception logic
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
      return;
    }
    root.classList.add(theme);
  }, [theme]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<div className="p-8 text-primary font-bold">Phase 5A Core Built - Greening India</div>} />
        {/* Further Layout/Auth nesting triggers here in Phase 5B */}
      </Routes>
    </Router>
  );
}

export default App;
