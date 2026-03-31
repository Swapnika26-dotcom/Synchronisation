import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useSimulation } from '../useSimulation';
import { ControlPanel } from '../components/ControlPanel';
import { AlgorithmPanel } from '../components/AlgorithmPanel';
import { GraphsPanel } from '../components/GraphsPanel';
import { ProcessNode } from '../components/ProcessNode';
import { cn } from '../lib/utils';
import { Layers, ShieldAlert, Lock, HelpCircle, ArrowLeft } from 'lucide-react';

export default function VisualizerPage() {
  const { state, setState, resetSimulation, step } = useSimulation();
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans">
      {/* Left Sidebar: Controls */}
      <ControlPanel 
        algorithm={state.algorithm}
        isRunning={state.isRunning}
        speed={state.speed}
        processCount={state.processes.length}
        onStart={() => setState(s => ({ ...s, isRunning: true }))}
        onPause={() => setState(s => ({ ...s, isRunning: false }))}
        onReset={() => resetSimulation()}
        onStep={step}
        onAlgoChange={(algo) => resetSimulation(algo)}
        onSpeedChange={(speed) => setState(s => ({ ...s, speed }))}
        onCountChange={(count) => resetSimulation(state.algorithm, count)}
      />

      {/* Main Content: Visualization and Graphs */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Header / Stats */}
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate('/')}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
              title="Back to Home"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="h-8 w-px bg-slate-100" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Current Algorithm</span>
              <span className="text-sm font-semibold text-slate-900">{state.algorithm.replace('_', ' ')}</span>
            </div>
            <div className="h-8 w-px bg-slate-100" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Steps</span>
              <span className="text-sm font-mono font-semibold text-blue-600">{state.currentStep}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {state.algorithm === 'RACE_CONDITION' && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-100 rounded-full text-red-600">
                <ShieldAlert className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Race Condition Mode</span>
              </div>
            )}
            {state.algorithm === 'DEADLOCK' && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-100 rounded-full text-amber-600">
                <Lock className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Deadlock Risk</span>
              </div>
            )}
          </div>
        </header>

        {/* Visualization Stage */}
        <div className="flex-1 relative overflow-hidden bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px]">
          {/* Waiting Queue Area */}
          <div 
            className="absolute left-12 top-1/2 -translate-y-1/2 w-48 h-[400px] border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-4"
            onMouseEnter={() => setHoveredZone('queue')}
            onMouseLeave={() => setHoveredZone(null)}
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300 absolute top-4">Waiting Queue</span>
            {state.waitingQueue.length === 0 && (
              <p className="text-[10px] text-slate-300 text-center italic">No processes waiting</p>
            )}
            {hoveredZone === 'queue' && (
              <div className="absolute top-0 left-0 w-full h-full bg-white/80 backdrop-blur-sm rounded-2xl p-4 z-20 flex flex-col items-center justify-center text-center">
                <HelpCircle className="w-6 h-6 text-blue-500 mb-2" />
                <h4 className="text-xs font-bold text-slate-900 mb-1">Process Queue</h4>
                <p className="text-[10px] text-slate-600 leading-relaxed">
                  Processes that are blocked by the synchronization primitive wait here until signaled.
                </p>
              </div>
            )}
          </div>

          {/* Critical Section Area */}
          <div 
            className={cn(
              "absolute right-24 top-1/2 -translate-y-1/2 w-64 h-64 rounded-3xl border-4 transition-all duration-500 flex flex-col items-center justify-center p-6",
              state.criticalSection.length > 1 ? "border-red-400 bg-red-50" : "border-blue-400 bg-blue-50/50",
              state.criticalSection.length > 0 && "critical-section-glow"
            )}
            onMouseEnter={() => setHoveredZone('cs')}
            onMouseLeave={() => setHoveredZone(null)}
          >
            <div className="absolute -top-4 bg-white px-4 py-1 rounded-full border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Critical Section</span>
            </div>
            
            <Layers className={cn(
              "w-12 h-12 mb-4 transition-colors",
              state.criticalSection.length > 1 ? "text-red-500" : "text-blue-500"
            )} />

            {state.criticalSection.length === 0 && (
              <p className="text-[10px] text-slate-400 text-center italic">Resource Idle</p>
            )}
            
            {state.criticalSection.length > 1 && (
              <div className="text-center animate-pulse">
                <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider">Race Condition!</p>
                <p className="text-[9px] text-red-500">Multiple processes detected in CS</p>
              </div>
            )}

            {hoveredZone === 'cs' && (
              <div className="absolute top-0 left-0 w-full h-full bg-white/90 backdrop-blur-sm rounded-3xl p-6 z-20 flex flex-col items-center justify-center text-center">
                <Lock className="w-6 h-6 text-blue-500 mb-2" />
                <h4 className="text-xs font-bold text-slate-900 mb-1">Shared Resource</h4>
                <p className="text-[10px] text-slate-600 leading-relaxed">
                  Only one process should be here at a time. Synchronization algorithms enforce this rule.
                </p>
              </div>
            )}
          </div>

          {/* Connection Lines (Visual only) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10">
            <line x1="200" y1="50%" x2="500" y2="50%" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
          </svg>

          {/* Deadlock Circular Dependency Diagram */}
          {state.algorithm === 'DEADLOCK' && state.waitingQueue.length >= 2 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-96 h-96 border-4 border-red-500/20 rounded-full flex items-center justify-center"
              >
                <div className="absolute top-0 flex flex-col items-center">
                  <div className="w-12 h-12 bg-slate-800 text-white rounded-lg flex items-center justify-center font-mono text-xs">R1</div>
                  <motion.div 
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-red-500"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </motion.div>
                </div>
                <div className="absolute bottom-0 flex flex-col items-center">
                  <div className="w-12 h-12 bg-slate-800 text-white rounded-lg flex items-center justify-center font-mono text-xs">R2</div>
                </div>
                <svg className="absolute inset-0 w-full h-full">
                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" />
                    </marker>
                  </defs>
                  {/* P0 -> R2 (Waiting) */}
                  <path d="M 150 100 Q 200 200 200 300" stroke="#ef4444" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
                  {/* P1 -> R1 (Waiting) */}
                  <path d="M 250 300 Q 200 200 200 100" stroke="#ef4444" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
                </svg>
                <div className="bg-red-500 text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest animate-pulse">
                  Deadlock Detected
                </div>
              </motion.div>
            </div>
          )}

          {/* Process Nodes */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="relative w-full h-full flex items-center justify-center">
              {state.processes.map((p) => (
                <ProcessNode 
                  key={p.id}
                  process={p}
                  isWaiting={state.waitingQueue.includes(p.id)}
                  isInCS={state.criticalSection.includes(p.id)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Panel: Graphs */}
        <div className="h-64 border-t border-slate-200 bg-slate-50/50 p-6">
          <GraphsPanel history={state.history} />
        </div>
      </main>

      {/* Right Sidebar: Algorithm Details */}
      <AlgorithmPanel 
        algorithm={state.algorithm}
        variables={state.variables}
        logs={state.logs}
      />
    </div>
  );
}
