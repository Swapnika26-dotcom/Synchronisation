import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Concepts } from './components/Concepts';
import { Simulator } from './components/Simulator';
import { Analytics } from './components/Analytics';
import { Quiz } from './components/Quiz';
import { Playground } from './components/Playground';
import { cn } from './lib/utils';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'concepts' | 'simulator' | 'playground' | 'analytics' | 'quiz'>('home');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={cn("min-h-screen bg-background text-foreground transition-colors duration-300 selection:bg-primary selection:text-primary-foreground", theme ==='dark' ? 'dark' : '')}>
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        theme={theme} 
        toggleTheme={toggleTheme} 
      />
      
      <main className="container mx-auto px-4 pt-20 pb-12">
        {activeTab === 'home' && (
          <Hero 
            onStart={() => setActiveTab('simulator')} 
            onExplore={() => setActiveTab('concepts')} 
          />
        )}
        {activeTab === 'concepts' && <Concepts />}
        {activeTab === 'simulator' && <Simulator />}
        {activeTab === 'playground' && <Playground />}
        {activeTab === 'analytics' && <Analytics />}
        {activeTab === 'quiz' && <Quiz />}
      </main>

      <footer className="border-t border-border py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p className="text-xs opacity-50 italic">© 2026 SyncMaster - OS Process Synchronization Simulator</p>
          <p className="mt-1 text-xs opacity-50 italic">
            Guided by Prof.Mr.P.Venkata Rajulu, Built by Swapnika krishna Jakka
          </p>
        </div>
      </footer>
    </div>
  );
}
