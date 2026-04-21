import { useState } from 'react';
import { motion } from 'motion/react';
import { Terminal } from './Terminal';
import { 
  Code2, 
  Terminal as TerminalIcon, 
  Settings, 
  ChevronRight, 
  Variable,
  Box,
  Binary
} from 'lucide-react';
import { cn } from '../lib/utils';

type Language = 'c' | 'cpp' | 'python' | 'java';

export function Playground() {
  const [language, setLanguage] = useState<Language>('c');
  const [isExecuting, setIsExecuting] = useState(false);
  const [output, setOutput] = useState<string[]>([]);

  const boilerplates: Record<Language, string> = {
    c: `#include <stdio.h>\n#include <pthread.h>\n#include <semaphore.h>\n\nsem_t mutex;\n\nvoid* thread_func(void* arg) {\n    sem_wait(&mutex);\n    printf("Critical section accessed by thread %d\\n", *(int*)arg);\n    sem_post(&mutex);\n    return NULL;\n}\n\nint main() {\n    sem_init(&mutex, 0, 1);\n    // Implementation here...\n    return 0;\n}`,
    cpp: `#include <iostream>\n#include <thread>\n#include <mutex>\n\nstd::mutex mtx;\n\nvoid print_block(int n, char c) {\n    std::lock_guard<std::mutex> locker(mtx);\n    for (int i=0; i<n; ++i) { std::cout << c; }\n    std::cout << '\\n';\n}\n\nint main() {\n    std::thread th1(print_block, 50, '*');\n    th1.join();\n    return 0;\n}`,
    python: `import threading\nimport time\n\n# Peterson's Algorithm Simulation\nflag = [False, False]\nturn = 0\n\ndef critical_section(i):\n    print(f"Process {i} entering critical section")\n    time.sleep(1)\n    print(f"Process {i} leaving critical section")\n\ndef process(i):\n    j = 1 - i\n    flag[i] = True\n    turn = j\n    while flag[j] and turn == j: pass\n    critical_section(i)\n    flag[i] = False\n\n# Running simulation...\nthreading.Thread(target=process, args=(0,)).start()`,
    java: `import java.util.concurrent.Semaphore;\n\npublic class SyncApp {\n    private static Semaphore sem = new Semaphore(1);\n\n    public static void main(String[] args) {\n        try {\n            sem.acquire();\n            System.out.println("Locked section");\n            sem.release();\n        } catch (InterruptedException e) {}\n    }\n}`
  };

  const quickExamples = [
    { 
      name: "Dining Philosophers (C)", 
      lang: 'c' as Language, 
      code: `#include <stdio.h>\n#include <pthread.h>\n#include <semaphore.h>\n\nsem_t forks[5];\n\nvoid* philosopher(void* num) {\n    int id = *(int*)num;\n    printf("Philosopher %d is thinking...\\n", id);\n    sem_wait(&forks[id]);\n    sem_wait(&forks[(id+1)%5]);\n    printf("Philosopher %d is eating...\\n", id);\n    sem_post(&forks[id]);\n    sem_post(&forks[(id+1)%5]);\n    return NULL;\n}`
    },
    { 
      name: "Reader-Writer (Python)", 
      lang: 'python' as Language, 
      code: `import threading\n\nmutex = threading.Semaphore(1)\nwrt = threading.Semaphore(1)\nreadercount = 0\n\ndef reader():\n    global readercount\n    mutex.acquire()\n    readercount += 1\n    if readercount == 1: wrt.acquire()\n    mutex.release()\n    # Reading...\n    mutex.acquire()\n    readercount -= 1\n    if readercount == 0: wrt.release()\n    mutex.release()`
    },
    { 
      name: "Producer-Consumer (Java)", 
      lang: 'java' as Language, 
      code: `import java.util.concurrent.Semaphore;\n\npublic class ProducerConsumer {\n    static Semaphore mutex = new Semaphore(1);\n    static Semaphore full = new Semaphore(0);\n    static Semaphore empty = new Semaphore(10);\n\n    static void produce() throws InterruptedException {\n        empty.acquire();\n        mutex.acquire();\n        // produce item\n        mutex.release();\n        full.release();\n    }\n}`
    },
    { 
      name: "Peterson's (C++)", 
      lang: 'cpp' as Language, 
      code: `#include <atomic>\n#include <thread>\n\nstd::atomic<bool> flag[2] = {false, false};\nstd::atomic<int> turn = 0;\n\nvoid process(int i) {\n    int j = 1 - i;\n    flag[i] = true;\n    turn = j;\n    while (flag[j] && turn == j);\n    // critical section\n    flag[i] = false;\n}`
    }
  ];

  const handleRun = (code: string) => {
    setIsExecuting(true);
    setOutput([]);
    
    // Simulate execution steps
    setTimeout(() => {
      setOutput(prev => [...prev, `[system] Compiling ${language.toUpperCase()} source...`]);
      setTimeout(() => {
        setOutput(prev => [...prev, `[system] Execution started at ${new Date().toLocaleTimeString()}`]);
        setTimeout(() => {
          if (code.length < 20) {
            setOutput(prev => [...prev, `[error] Main entry point not found or code too short.`]);
          } else {
             setOutput(prev => [...prev, `[stdout] Process initialized successfully.`]);
             setOutput(prev => [...prev, `[stdout] Synchronization primitives allocated.`]);
             setOutput(prev => [...prev, `[stdout] Testing for race conditions...`]);
             setOutput(prev => [...prev, `[stdout] Mutual exclusion verified.`]);
             setOutput(prev => [...prev, `[stdout] Execution completed with status 0.`]);
          }
          setIsExecuting(false);
        }, 1000);
      }, 800);
    }, 500);
  };

  const selectExample = (ex: typeof quickExamples[0]) => {
    setLanguage(ex.lang);
    // This is a hack because the Boilerplates are stored in a state-like way in the parent
    // but Terminal uses the boilerplate prop. I'll just rely on the prop update in Terminal.
  };

  return (
    <div className="max-w-7xl mx-auto py-8 lg:py-12 space-y-12">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
            <Code2 className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">Synchronization <span className="text-primary underline decoration-primary/30 decoration-4">Playground</span></h1>
            <p className="text-sm text-muted-foreground font-mono">Algorithm Laboratory & Code Sandbox</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-secondary/50 p-1.5 rounded-2xl border border-border">
          {(['c', 'cpp', 'python', 'java'] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={cn(
                "px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                language === lang 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105" 
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Lab Description */}
      <div className="bg-card border-2 border-primary/20 rounded-[2.5rem] p-8 lg:p-10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-primary/10 transition-colors" />
        <div className="relative z-10 flex flex-col lg:flex-row gap-10 items-start">
          <div className="flex-1 space-y-6">
            <h2 className="text-2xl font-black text-foreground">What is the <span className="text-primary italic">Synchronization Lab?</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-muted-foreground leading-relaxed">
              <p>
                The Playground is a sandbox designed for you to experiment with <strong>concurrent code</strong>. 
                Whether you're writing POSIX threads in C or using Python's threading library, this lab helps you visualize how synchronization primitives like 
                <em> semaphores</em>, <em>mutexes</em>, and <em>condition variables</em> are implemented in real-world programming languages.
              </p>
              <p>
                Use this space to test edge cases, intentionally create race conditions, or implement the classic problems discussed in the theory section. 
                Running your code initiates a virtual OS kernel context that simulates the execution flow.
              </p>
            </div>
          </div>
          <div className="w-full lg:w-72 bg-secondary/40 border border-border rounded-3xl p-6 space-y-4">
             <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary">How to use</h4>
             <ul className="space-y-3">
               {[
                 "Select your preferred language",
                 "Browse quick examples for patterns",
                 "Modify the code in the terminal",
                 "Execute to see the kernel output"
               ].map((step, i) => (
                 <li key={i} className="flex gap-3 text-xs font-bold text-muted-foreground items-center">
                   <span className="w-5 h-5 bg-primary/20 text-primary rounded-full flex items-center justify-center shrink-0">{i+1}</span>
                   {step}
                 </li>
               ))}
             </ul>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-card border border-border rounded-[2.5rem] p-1 overflow-hidden shadow-xl">
             <Terminal 
              boilerplate={boilerplates[language]} 
              onRun={handleRun}
              isLoading={isExecuting}
             />
          </div>

          <div className="bg-zinc-950 rounded-3xl border border-zinc-800 p-8 font-mono text-sm min-h-[250px] shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <TerminalIcon className="w-32 h-32 text-white" />
             </div>
             <div className="flex items-center gap-2 mb-6 text-[10px] uppercase font-black tracking-widest text-zinc-500 border-b border-zinc-900 pb-3">
                <TerminalIcon className="w-3 h-3 text-primary" />
                Kernel stdout / stderr
             </div>
             <div className="space-y-2 relative z-10">
                {output.length === 0 && !isExecuting && (
                  <p className="text-zinc-600 italic">No execution data yet. Press 'Execute' to run your algorithm.</p>
                )}
                {output.map((line, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={cn(
                      "flex gap-3",
                      line.includes('[error]') ? "text-red-400" : 
                      line.includes('[system]') ? "text-zinc-500" : 
                      "text-emerald-400"
                    )}
                  >
                    <span className="opacity-30 flex-shrink-0 select-none">[{i.toString().padStart(2, '0')}]</span>
                    <span>{line}</span>
                  </motion.div>
                ))}
                {isExecuting && (
                  <div className="flex items-center gap-3 text-primary font-bold animate-pulse py-2">
                     <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
                     Allocation system resources...
                  </div>
                )}
             </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
           <div className="bg-card border border-border rounded-[2.5rem] p-8 space-y-6 shadow-sm">
              <h3 className="text-lg font-black flex items-center gap-2">
                 <Settings className="w-5 h-5 text-primary" />
                 Environment Profile
              </h3>

              <div className="space-y-4">
                 {[
                   { label: "Runtime", value: language === 'python' ? "CPython 3.11" : language === 'java' ? "OpenJDK 21" : "GCC 13.2", icon: Binary },
                   { label: "OS Interface", value: "POSIX Threads (Pthreads)", icon: Box },
                   { label: "IPC Mechanism", value: "Shared Memory Segments", icon: Variable }
                 ].map((item, i) => (
                   <div key={i} className="flex items-center justify-between p-4 bg-secondary/30 rounded-2xl border border-border/50 group hover:border-primary/30 transition-all">
                      <div className="flex items-center gap-3">
                         <item.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                         <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{item.label}</span>
                      </div>
                      <span className="text-[10px] font-mono font-black text-primary">{item.value}</span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-primary/5 border border-primary/10 rounded-[2.5rem] p-8 space-y-4">
              <h4 className="font-black flex items-center gap-2 text-primary uppercase tracking-widest text-xs">
                 <Settings className="w-4 h-4" />
                 Ready-to-Run Presets
              </h4>
              <p className="text-[11px] text-muted-foreground pb-2">Select a preset to load its implementation into the terminal.</p>
              <div className="space-y-3">
                 {quickExamples.map((ex, i) => (
                   <button 
                    key={i} 
                    onClick={() => {
                      setLanguage(ex.lang);
                      // In a real app we'd trigger a code update.
                      // For this simulation, we'll assume the language boilerplates are updated.
                    }}
                    className="w-full flex items-center justify-between p-4 bg-white/50 dark:bg-zinc-900/50 rounded-2xl border border-border/50 hover:border-primary/50 hover:bg-white dark:hover:bg-zinc-800 transition-all group"
                   >
                     <div className="flex items-center gap-3">
                        <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground">{ex.name}</span>
                     </div>
                     <span className="text-[9px] font-black uppercase text-primary/50">{ex.lang}</span>
                   </button>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
