import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, 
  BookOpen, 
  CheckCircle2, 
  Github, 
  ArrowRight,
  Monitor,
  ShieldAlert,
  Lock
} from 'lucide-react';
import { cn } from '../lib/utils';

const SECTIONS = [
  {
    id: 'visualizer',
    title: 'Interactive Visualizer',
    description: 'Real-time simulation of Peterson\'s algorithm, semaphores, and mutex locks.',
    icon: Monitor,
    color: 'bg-blue-500',
    path: '/visualizer'
  },
  {
    id: 'theory',
    title: 'Theory & Concepts',
    description: 'Deep dive into critical sections, race conditions, and synchronization primitives.',
    icon: BookOpen,
    color: 'bg-indigo-500',
    path: '/theory'
  },
  {
    id: 'quiz',
    title: 'Knowledge Quiz',
    description: 'Test your understanding of OS synchronization with interactive challenges.',
    icon: CheckCircle2,
    color: 'bg-emerald-500',
    path: '/quiz'
  }
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Hero Section */}
      <header className="relative overflow-hidden pt-24 pb-16 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-blue-600 text-xs font-bold uppercase tracking-widest"
          >
            <Zap className="w-4 h-4 fill-blue-600" />
            Interactive Learning Platform
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-tight"
          >
            Master OS <span className="text-blue-600">Synchronization</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-lg text-slate-600 leading-relaxed"
          >
            A modern visualization platform to explore concurrent process coordination, 
            race conditions, and deadlock prevention through interactive simulations.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-4"
          >
            <button 
              onClick={() => navigate('/visualizer')}
              className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center gap-2 group"
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center gap-2">
              <Github className="w-5 h-5" />
              View Source
            </button>
          </motion.div>
        </div>

        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-0 opacity-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-400 rounded-full blur-3xl" />
        </div>
      </header>

      {/* Section Cards */}
      <main className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-8">
        {SECTIONS.map((section, i) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
            onClick={() => navigate(section.path)}
            className="group bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer flex flex-col"
          >
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg", section.color)}>
              <section.icon className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{section.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">{section.description}</p>
            <div className="mt-auto flex items-center gap-2 text-blue-600 font-bold text-sm">
              Explore Section
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        ))}
      </main>

      {/* Features Grid */}
      <section className="bg-slate-900 py-24 px-6 text-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-black tracking-tight">Why Visual Learning?</h2>
            <p className="text-slate-400 leading-relaxed">
              Operating System concepts like synchronization are notoriously abstract. 
              Our platform bridges the gap between theory and practice by providing 
              a sandbox where you can break things, fix them, and see exactly why 
              race conditions occur.
            </p>
            <div className="space-y-4">
              {[
                { icon: ShieldAlert, text: 'Simulate Race Conditions in real-time', color: 'text-red-400' },
                { icon: Lock, text: 'Visualize Deadlock circular dependencies', color: 'text-amber-400' },
                { icon: Zap, text: 'Step-by-step algorithm execution', color: 'text-blue-400' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={cn("p-2 bg-white/5 rounded-lg", item.color)}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-slate-300">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-video bg-slate-800 rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex items-center justify-center p-8">
               <div className="w-full h-full border-2 border-dashed border-white/20 rounded-2xl flex items-center justify-center">
                  <Monitor className="w-16 h-16 text-white/20" />
               </div>
            </div>
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 text-center">
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
          © 2026 SyncVisual Platform • Built for OS Education
        </p>
      </footer>
    </div>
  );
}
