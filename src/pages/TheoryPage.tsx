import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Layers, Lock, ShieldAlert } from 'lucide-react';

export default function TheoryPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="h-16 border-b border-slate-200 bg-white flex items-center px-8 sticky top-0 z-10">
        <button 
          onClick={() => navigate('/')}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 mr-4"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-slate-900">Theory & Concepts</h1>
      </header>

      <main className="max-w-4xl mx-auto py-16 px-6 space-y-16">
        <section className="space-y-6">
          <div className="flex items-center gap-4 text-blue-600">
            <Layers className="w-8 h-8" />
            <h2 className="text-3xl font-black tracking-tight">The Critical Section Problem</h2>
          </div>
          <p className="text-slate-600 leading-relaxed">
            In concurrent programming, a <strong>critical section</strong> is a part of a multi-process program 
            that accesses a shared resource (such as a common variable, static data, or peripheral device) 
            that must not be concurrently accessed by more than one thread of execution.
          </p>
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900">Requirements for a Solution:</h3>
            <ul className="space-y-4">
              <li className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">1</div>
                <div>
                  <span className="font-bold text-slate-900">Mutual Exclusion:</span>
                  <p className="text-sm text-slate-500">If process P is executing in its critical section, then no other processes can be executing in their critical sections.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">2</div>
                <div>
                  <span className="font-bold text-slate-900">Progress:</span>
                  <p className="text-sm text-slate-500">If no process is executing in its critical section and some processes wish to enter their critical sections, then only those processes that are not executing in their remainder sections can participate in deciding which will enter its critical section next.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">3</div>
                <div>
                  <span className="font-bold text-slate-900">Bounded Waiting:</span>
                  <p className="text-sm text-slate-500">There exists a bound, or limit, on the number of times that other processes are allowed to enter their critical sections after a process has made a request to enter its critical section and before that request is granted.</p>
                </div>
              </li>
            </ul>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-4 text-red-600">
            <ShieldAlert className="w-8 h-8" />
            <h2 className="text-3xl font-black tracking-tight">Race Conditions</h2>
          </div>
          <p className="text-slate-600 leading-relaxed">
            A <strong>race condition</strong> occurs when two or more threads can access shared data and they try to change it at the same time. 
            Because the thread scheduling algorithm can swap between threads at any time, you don't know the order in which the threads 
            will attempt to access the shared data. Therefore, the result of the change in data is dependent on the thread scheduling algorithm.
          </p>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-4 text-amber-600">
            <Lock className="w-8 h-8" />
            <h2 className="text-3xl font-black tracking-tight">Deadlocks</h2>
          </div>
          <p className="text-slate-600 leading-relaxed">
            A <strong>deadlock</strong> is a situation in which two or more competing actions are each waiting for the other to finish, 
            and thus neither ever does. In an operating system, a deadlock occurs when a process or thread enters a waiting state 
            because a requested system resource is held by another waiting process, which in turn is waiting for another resource 
            held by another waiting process.
          </p>
        </section>
      </main>

      <footer className="py-12 border-t border-slate-200 text-center bg-white">
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
          SyncVisual Theory Module
        </p>
      </footer>
    </div>
  );
}
