import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Settings2, 
  Activity, 
  History,
  AlertCircle,
  CheckCircle2,
  Clock,
  Shield,
  Terminal,
  Zap,
  Layers,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { AlgorithmType, SimulationState, Process } from '../types';
import { COLORS, ALGORITHMS } from '../constants';

export function Simulator() {
  const [algo, setAlgo] = useState<AlgorithmType>('mutex');
  const [processCount, setProcessCount] = useState(4);
  const [burstTime, setBurstTime] = useState(3);
  const [speed, setSpeed] = useState(1);
  const [targetExecs, setTargetExecs] = useState(1);
  
  const [state, setState] = useState<SimulationState>({
    time: 0,
    processes: [],
    queue: [],
    criticalSection: [],
    ganttData: [],
    logs: ['Simulation initialized.'],
    isRunning: false,
    isPaused: false,
    isFinished: false,
    speed: 1,
    algorithm: 'mutex',
    stats: {
      totalWaitTime: 0,
      completedCount: 0,
      csEntries: 0
    }
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const initProcesses = useCallback(() => {
    const count = algo === 'peterson' ? 2 : processCount;
    const newProcesses: Process[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      state: 'idle',
      color: COLORS[i % COLORS.length],
      waitTime: 0,
      burstTime: burstTime + (Math.random() * 2 - 1),
      remainingTime: 0,
      progress: 0,
      completedExecutions: 0,
      targetExecutions: targetExecs
    }));

    setState(prev => ({
      ...prev,
      time: 0,
      processes: newProcesses,
      queue: [],
      criticalSection: [],
      ganttData: [],
      logs: [`Initialized ${algo} simulation with ${count} processes. Each will execute ${targetExecs} time(s).`],
      isRunning: false,
      isPaused: false,
      isFinished: false,
      algorithm: algo,
      stats: {
        totalWaitTime: 0,
        completedCount: 0,
        csEntries: 0
      }
    }));
  }, [algo, processCount, burstTime, targetExecs]);

  useEffect(() => {
    initProcesses();
  }, [initProcesses]);

  const addLog = (msg: string) => {
    setState(prev => ({
      ...prev,
      logs: [msg, ...prev.logs].slice(0, 50)
    }));
  };

  const tick = useCallback(() => {
    setState(prev => {
      if (prev.isPaused || !prev.isRunning) return prev;

      const nextTime = prev.time + (0.1 * speed);
      let nextProcesses = [...prev.processes];
      let nextQueue = [...prev.queue];
      let nextCS = [...prev.criticalSection];
      let nextGantt = [...prev.ganttData];
      let nextStats = { ...prev.stats };
      let logs = [...prev.logs];

      // Check if finished
      const allFinished = nextProcesses.every(p => p.state === 'finished');
      if (allFinished) {
        return { ...prev, isRunning: false, isFinished: true };
      }

      // 1. Update existing processes
      nextProcesses = nextProcesses.map(p => {
        if (p.state === 'waiting') {
          return { ...p, waitTime: p.waitTime + 0.1 };
        }
        if (p.state === 'running') {
          const newRemaining = Math.max(0, p.remainingTime - 0.1);
          const progress = ((p.burstTime - newRemaining) / p.burstTime) * 100;
          return { ...p, remainingTime: newRemaining, progress };
        }
        return p;
      });

      // 2. Handle state transitions
      nextProcesses = nextProcesses.map(p => {
        if (p.state === 'idle' && p.completedExecutions < p.targetExecutions) {
          if (Math.random() < 0.05) {
            nextQueue.push(p.id);
            return { ...p, state: 'requesting' };
          }
        }
        if (p.state === 'requesting') {
          return { ...p, state: 'waiting' };
        }
        return p;
      });

      // 3. Algorithm Logic
      const canEnterCS = () => {
        if (prev.algorithm === 'mutex' || prev.algorithm === 'peterson') {
          return nextCS.length === 0;
        }
        if (prev.algorithm === 'semaphore') {
          return nextCS.length < 2; 
        }
        return nextCS.length === 0;
      };

      if (nextQueue.length > 0 && canEnterCS()) {
        const nextId = nextQueue[0];
        nextQueue.shift();
        nextCS.push(nextId);
        
        const proc = nextProcesses.find(p => p.id === nextId);
        if (proc) {
          nextGantt.push({
            processId: nextId,
            start: prev.time,
            end: prev.time,
            color: proc.color
          });
        }

        nextProcesses = nextProcesses.map(p => 
          p.id === nextId ? { ...p, state: 'running', remainingTime: p.burstTime, progress: 0 } : p
        );
        nextStats.csEntries++;
      }

      // 4. Handle completion
      const finishedIds: number[] = [];
      nextProcesses = nextProcesses.map(p => {
        if (p.state === 'running' && p.remainingTime <= 0) {
          finishedIds.push(p.id);
          const nextCompleted = p.completedExecutions + 1;
          
          const lastEntryIdx = nextGantt.length - 1 - [...nextGantt].reverse().findIndex(e => e.processId === p.id);
          if (lastEntryIdx !== -1) {
            nextGantt[lastEntryIdx] = { ...nextGantt[lastEntryIdx], end: prev.time };
          }

          if (nextCompleted >= p.targetExecutions) {
            return { ...p, state: 'finished', completedExecutions: nextCompleted, progress: 0 };
          }
          return { ...p, state: 'idle', completedExecutions: nextCompleted, progress: 0, burstTime: burstTime + (Math.random() * 2 - 1) };
        }
        return p;
      });

      if (finishedIds.length > 0) {
        nextCS = nextCS.filter(id => !finishedIds.includes(id));
        nextStats.completedCount += finishedIds.length;
      }

      const trulyFinished = nextProcesses.every(p => p.state === 'finished');

      return {
        ...prev,
        time: nextTime,
        processes: nextProcesses,
        queue: nextQueue,
        criticalSection: nextCS,
        ganttData: nextGantt,
        stats: nextStats,
        logs: trulyFinished ? ["Simulation completed.", ...logs].slice(0, 50) : logs,
        isRunning: !trulyFinished,
        isFinished: trulyFinished
      };
    });
  }, [speed, burstTime]);

  useEffect(() => {
    if (state.isRunning && !state.isPaused) {
      timerRef.current = setInterval(tick, 100 / speed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.isRunning, state.isPaused, speed, tick]);

  const startSimulation = () => {
    setState(prev => ({ ...prev, isRunning: true, isPaused: false }));
    addLog("Simulation started.");
  };

  const stopSimulation = () => {
    setState(prev => ({ ...prev, isRunning: false }));
    addLog("Simulation stopped.");
  };

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Sidebar Controls */}
        <div className="xl:col-span-3 space-y-6">
          <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm">
            <h2 className="text-xl font-black mb-6 flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-primary" />
              Configure
            </h2>
            
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Mechanism</label>
                  <div className="px-2 py-0.5 bg-primary/10 rounded text-[10px] font-bold text-primary">Live</div>
                </div>
                <div className="grid gap-2">
                  {(['mutex', 'semaphore', 'peterson'] as AlgorithmType[]).map((id) => (
                    <button
                      key={id}
                      disabled={state.isRunning}
                      onClick={() => setAlgo(id)}
                      className={cn(
                        "w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all border-2",
                        algo === id 
                          ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20" 
                          : "border-transparent hover:bg-accent text-muted-foreground"
                      )}
                    >
                      {id.charAt(0).toUpperCase() + id.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6 pt-4 border-t border-border/50">
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-muted-foreground uppercase tracking-widest">Processes</span>
                    <span className="text-primary">{processCount}</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="6"
                    value={processCount}
                    onChange={(e) => setProcessCount(parseInt(e.target.value))}
                    disabled={state.isRunning}
                    className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-muted-foreground uppercase tracking-widest">Speed</span>
                    <span className="text-primary">{speed}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.5"
                    value={speed}
                    onChange={(e) => setSpeed(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={state.isRunning ? stopSimulation : startSimulation}
                  className={cn(
                    "w-full py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-xl",
                    state.isRunning 
                      ? "bg-red-500 text-white shadow-red-500/20 hover:bg-red-600" 
                      : "bg-primary text-primary-foreground shadow-primary/20 hover:scale-[1.02] active:scale-95"
                  )}
                >
                  {state.isRunning ? (
                    <>
                      <Pause className="w-5 h-5 fill-current" />
                      Terminate
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 fill-current" />
                      Execute
                    </>
                  )}
                </button>
                
                {state.isFinished && (
                  <button
                    onClick={initProcesses}
                    className="w-full mt-3 py-4 bg-secondary text-secondary-foreground rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-accent transition-all flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Visualization area */}
        <div className="xl:col-span-9 bg-card border border-border rounded-[3rem] p-10 min-h-[650px] flex flex-col relative overflow-hidden shadow-sm">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-primary/10">
            <motion.div 
              className="h-full bg-primary"
              animate={{ width: state.isRunning ? '100%' : '0%' }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
          </div>

          <div className="flex items-center justify-between mb-12">
            <div className="space-y-1">
              <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                <div className={cn("w-3 h-3 rounded-full", state.isRunning ? "bg-green-500 animate-pulse" : "bg-muted")} />
                Live Kernel Visualization
              </h2>
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">{state.algorithm} Coordination flow</p>
            </div>
            
            <div className="flex gap-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 bg-secondary/30 px-6 py-2.5 rounded-full border border-border/50">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-muted border border-border" /> Idle
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.3)]" /> Waiting
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.3)]" /> Running
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center relative">
            {/* Wait Queue Area */}
            <div className="absolute top-0 left-0 space-y-4">
               <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40">Queue Pipeline</div>
               <div className="flex flex-col gap-3">
                  <AnimatePresence>
                    {state.queue.length === 0 ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-[10px] font-bold text-muted-foreground py-2 italic"
                      >
                        Pipeline clear...
                      </motion.div>
                    ) : (
                      state.queue.slice(0, 5).map((id, index) => {
                        const p = state.processes.find(proc => proc.id === id);
                        return (
                          <motion.div
                            key={`${id}-${index}`}
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-[10px] shadow-lg"
                            style={{ backgroundColor: p?.color }}
                          >
                            P{id}
                          </motion.div>
                        );
                      })
                    )}
                  </AnimatePresence>
               </div>
            </div>

            {/* Central CS Hub */}
            <div className="relative w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] rounded-full border-2 border-dashed border-border/40 flex items-center justify-center">
              <div className="absolute inset-0 bg-primary/2 rounded-full" />
              
              <div className="text-center z-10 space-y-6">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={state.criticalSection.length > 0 ? 'occupied' : 'empty'}
                    className="space-y-4"
                  >
                    <div className={cn(
                      "w-24 h-24 bg-background border-4 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl transition-all duration-700",
                      state.criticalSection.length > 0 ? "border-green-500 scale-110" : "border-primary"
                    )}>
                      {state.criticalSection.length > 0 ? (
                        <div className="relative">
                          <CheckCircle2 className="w-12 h-12 text-green-500" />
                          <motion.div 
                            className="absolute -inset-4 rounded-full border-2 border-green-500/30"
                            animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        </div>
                      ) : (
                        <Shield className="w-12 h-12 text-primary" />
                      )}
                    </div>
                    
                    <div className={cn(
                      "inline-flex px-6 py-2 rounded-2xl text-xs font-black uppercase tracking-widest",
                      state.criticalSection.length > 0 ? "bg-green-500/10 text-green-500" : "bg-muted text-muted-foreground"
                    )}>
                      {state.criticalSection.length > 0 ? "Resource Locked" : "Available"}
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="flex flex-wrap justify-center gap-4 max-w-[200px] mx-auto min-h-[50px]">
                  {state.criticalSection.map(id => {
                    const p = state.processes.find(p => p.id === id);
                    return (
                      <motion.div
                        key={id}
                        layoutId={`proc-${id}`}
                        className="group relative"
                      >
                        <div 
                          className="w-12 h-12 rounded-2xl shadow-xl flex items-center justify-center text-xs font-black text-white"
                          style={{ backgroundColor: p?.color }}
                        >
                          P{id}
                        </div>
                        {p && (
                          <svg className="absolute -inset-2 w-[64px] h-[64px] -rotate-90 pointer-events-none">
                            <motion.circle
                              cx="32" cy="32" r="28"
                              fill="none" stroke="currentColor" strokeWidth="3"
                              strokeDasharray="176"
                              strokeLinecap="round"
                              animate={{ strokeDashoffset: 176 * (1 - p.progress / 100) }}
                              className="text-green-500/60"
                            />
                          </svg>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Orbiting Processes */}
              {state.processes.map((p, i) => {
                const angle = (i / state.processes.length) * 2 * Math.PI;
                const radiusX = 220; 
                const radiusY = 220; 
                const x = Math.cos(angle) * radiusX;
                const y = Math.sin(angle) * radiusY;
                
                const isWaiting = p.state === 'waiting' || p.state === 'requesting';
                const isRunning = p.state === 'running';

                return (
                  <motion.div
                    key={p.id}
                    className="absolute w-20 h-20"
                    animate={{
                      x: isRunning ? 0 : isWaiting ? -280 : x,
                      y: isRunning ? 0 : isWaiting ? ((i - (state.processes.length/2)) * 70) : y,
                      opacity: isRunning ? 0 : 1,
                      scale: isRunning ? 0.5 : 1,
                    }}
                    transition={{ type: 'spring', stiffness: 80, damping: 15 }}
                  >
                    <div className="relative group flex flex-col items-center">
                      <div 
                        className={cn(
                          "w-14 h-14 rounded-[1.25rem] border-4 border-background shadow-2xl flex items-center justify-center text-white font-black transition-all duration-300",
                          p.state === 'finished' ? "opacity-20 grayscale" : "hover:scale-110",
                          isWaiting && "ring-8 ring-amber-500/10"
                        )}
                        style={{ backgroundColor: p.color }}
                      >
                        P{p.id}
                      </div>
                      
                      <div className={cn(
                        "mt-3 px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest whitespace-nowrap shadow-sm",
                        isRunning ? "bg-green-500 text-white" : 
                        isWaiting ? "bg-amber-500 text-white" : 
                        p.state === 'finished' ? "bg-zinc-200 text-zinc-500" : "bg-muted text-muted-foreground"
                      )}>
                        {p.state}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Narrative - Fixed positioning at bottom of visualization */}
          <div className="mt-auto pt-10 flex justify-center">
             <div className="w-full max-w-2xl bg-secondary/40 border border-border rounded-2xl p-6 text-center">
                <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-2 italic">Kernel Event Stream</div>
                <p className="text-sm font-medium text-muted-foreground leading-relaxed italic">
                  {state.isRunning 
                    ? state.criticalSection.length > 0 
                      ? `Execution thread P${state.criticalSection[0]} is maintaining the ${state.algorithm} semaphore. Relinquishing occurs upon burst completion.`
                      : "Evaluating scheduling priority... the shared resource pool is currently vacuous."
                    : "Kernel context is dormant. Select execution parameters to begin the synchronization sequence."}
                </p>
             </div>
          </div>
        </div>
      </div>

      {/* Analysis Section Grid (Below Vis) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Terminal className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-lg font-black tracking-tight">System Logs</h2>
            </div>
            <div className="px-3 py-1 bg-secondary rounded-lg text-[10px] font-black text-muted-foreground uppercase tracking-widest">
              Live Stream
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-2 pr-3 custom-scrollbar font-mono text-xs">
            {state.logs.length === 0 && <div className="text-muted-foreground italic opacity-50">Awaiting kernel boot...</div>}
            {state.logs.map((log, i) => (
              <div key={i} className="py-2 border-b border-border/30 last:border-0 flex gap-4 animate-in fade-in slide-in-from-left-2 transition-all">
                <span className="text-muted-foreground opacity-20 font-bold min-w-[20px]">{(state.logs.length - i).toString().padStart(2, '0')}</span>
                <span className={cn(
                  "leading-relaxed",
                  log.includes('lock') || log.includes('acquired') ? "text-emerald-500 font-bold" : 
                  log.includes('waiting') || log.includes('blocked') ? "text-amber-500 font-medium" : 
                  "text-muted-foreground"
                )}>
                  {log}
                </span>
                <span className="ml-auto text-[8px] opacity-10 font-bold select-none">{new Date().toLocaleTimeString().split(' ')[0]}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-border/50 text-[10px] font-black uppercase text-muted-foreground flex justify-between tracking-widest">
            <span>Kernel: OK</span>
            <span>Buffered: {state.logs.length} events</span>
          </div>
        </div>

        <div className="bg-primary/[0.03] border border-primary/20 rounded-[2.5rem] p-8 flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-black tracking-tight text-primary">Protocol Blueprint</h3>
          </div>
           
          <div className="flex-1 space-y-8">
             <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-primary/60">Algorithm Definition</h4>
                <p className="text-sm font-semibold leading-relaxed text-secondary-foreground/80">
                  {ALGORITHMS.find(a => a.id === state.algorithm)?.description}
                </p>
             </div>

             <div className="grid grid-cols-2 gap-4">
                {ALGORITHMS.find(a => a.id === state.algorithm)?.properties.map((prop, i) => (
                  <div key={i} className="p-4 bg-background/80 rounded-2xl border border-primary/10 shadow-sm">
                    <span className="text-[9px] font-black text-primary/40 uppercase block mb-1.5 tracking-tighter">{prop.label}</span>
                    <span className="text-sm font-black">{prop.value}</span>
                  </div>
                ))}
             </div>

             <div className="mt-auto pt-6 border-t border-primary/10">
                <div className="flex items-center gap-2 text-primary/60 mb-3">
                   <Star className="w-4 h-4" />
                   <span className="text-[10px] font-black uppercase tracking-widest">Key Performance Metric</span>
                </div>
                <div className="text-xl font-black text-primary">
                  {state.isRunning ? (
                    <motion.span animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                       Calculating impact...
                    </motion.span>
                  ) : "Efficiency Rating: High"}
                </div>
             </div>
          </div>
        </div>
      </div>
      
      {/* Results Section (Replaced detailed version with a more compact one) */}
      <AnimatePresence>
        {state.isFinished && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-12 bg-zinc-900 border border-zinc-800 rounded-[3rem] p-12 text-white shadow-3xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
              <Zap className="w-48 h-48" />
            </div>

            <div className="relative z-10 space-y-12">
               <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  <div>
                    <h2 className="text-3xl font-black tracking-tight mb-3">Scheduling Summary</h2>
                    <p className="text-zinc-400 font-medium">Post-execution diagnostics for kernel context {state.algorithm}</p>
                  </div>
                  <button 
                    onClick={initProcesses}
                    className="flex items-center gap-2 px-10 py-5 bg-white text-black rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95"
                  >
                    <RotateCcw className="w-5 h-5" />
                    New Sequence
                  </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: "Total Latency", value: `${(state.processes.reduce((acc, p) => acc + p.waitTime, 0)).toFixed(1)}s`, icon: Clock },
                    { label: "Avg Block Time", value: `${(state.processes.reduce((acc, p) => acc + p.waitTime, 0) / state.processes.length).toFixed(2)}s`, icon: History },
                    { label: "Utilization", value: `${(state.ganttData.reduce((acc, e) => acc + (e.end - e.start), 0) / state.time * 100 / (state.algorithm === 'semaphore' ? 2 : 1)).toFixed(1)}%`, icon: Zap },
                    { label: "Throughput", value: `${(state.stats.completedCount / state.time).toFixed(2)} ops/s`, icon: Activity }
                  ].map((stat, i) => (
                    <div key={i} className="p-8 bg-white/5 rounded-3xl border border-white/10 group hover:border-white/20 transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <stat.icon className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors" />
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{i + 1}</span>
                      </div>
                      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-1">{stat.label}</span>
                      <span className="text-3xl font-black tracking-tight">{stat.value}</span>
                    </div>
                  ))}
               </div>

               <div className="pt-12 border-t border-white/10">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-8 flex items-center gap-3">
                    <Layers className="w-4 h-4" />
                    Kernal Timeline Allocation
                  </h3>
                  <div className="grid gap-6">
                    {state.processes.map(p => {
                      const pEntries = state.ganttData.filter(e => e.processId === p.id);
                      return (
                        <div key={p.id} className="relative h-12 flex items-center">
                          <div className="w-20 font-black text-xs text-zinc-500">P{p.id}</div>
                          <div className="flex-1 h-2.5 bg-white/5 rounded-full relative overflow-hidden">
                             {pEntries.map((entry, idx) => (
                               <motion.div
                                 key={idx}
                                 initial={{ scaleX: 0 }}
                                 animate={{ scaleX: 1 }}
                                 className="absolute h-full rounded-full origin-left"
                                 style={{ 
                                   left: `${(entry.start / state.time) * 100}%`, 
                                   width: `${((entry.end - entry.start) / state.time) * 100}%`,
                                   backgroundColor: p.color
                                 }}
                               />
                             ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
