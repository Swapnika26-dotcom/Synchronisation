import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Concepts } from './components/Concepts';
import { Simulator } from './components/Simulator';
import { Analytics } from './components/Analytics';
import { Quiz } from './components/Quiz';
import { Playground } from './components/Playground';
import { Academy } from './components/Academy';
import { cn } from './lib/utils';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'concepts' | 'academy' | 'playground' | 'quiz'>('home');
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
      
      <main className="container mx-auto px-4 pt-24 pb-20 sm:pt-48">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'home' && (
              <Hero 
                onStart={() => setActiveTab('concepts')} 
                onExplore={() => setActiveTab('academy')} 
              />
            )}
            {activeTab === 'concepts' && <Concepts />}
            {activeTab === 'academy' && <Academy />}
            {activeTab === 'playground' && <Playground />}
            {activeTab === 'quiz' && <Quiz />}
          </motion.div>
        </AnimatePresence>
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
