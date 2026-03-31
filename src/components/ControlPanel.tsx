import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  Settings2, 
  Users, 
  Zap,
  Info
} from 'lucide-react';
import { AlgorithmType } from '../types';
import { ALGORITHM_INFO } from '../constants';
import { cn } from '../lib/utils';

interface ControlPanelProps {
  algorithm: AlgorithmType;
  isRunning: boolean;
  speed: number;
  processCount: number;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onStep: () => void;
  onAlgoChange: (algo: AlgorithmType) => void;
  onSpeedChange: (speed: number) => void;
  onCountChange: (count: number) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  algorithm,
  isRunning,
  speed,
  processCount,
  onStart,
  onPause,
  onReset,
  onStep,
  onAlgoChange,
  onSpeedChange,
  onCountChange
}) => {
  return (
    <div className="bg-white border-r border-slate-200 w-80 flex flex-col h-full overflow-y-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Zap className="w-6 h-6 text-blue-500 fill-blue-500" />
          SyncVisual
        </h1>
        <p className="text-xs text-slate-500">OS Synchronization Visualizer</p>
      </div>

      <div className="space-y-4">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Settings2 className="w-3 h-3" />
          Algorithm
        </label>
        <select 
          value={algorithm}
          onChange={(e) => onAlgoChange(e.target.value as AlgorithmType)}
          className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {Object.entries(ALGORITHM_INFO).map(([key, info]) => (
            <option key={key} value={key}>{info.name}</option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Users className="w-3 h-3" />
            Processes
          </label>
          <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded">{processCount}</span>
        </div>
        <input 
          type="range" 
          min="1" 
          max="10" 
          value={processCount}
          disabled={algorithm === 'PETERSON'}
          onChange={(e) => onCountChange(parseInt(e.target.value))}
          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Zap className="w-3 h-3" />
            Speed
          </label>
          <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded">{speed}x</span>
        </div>
        <input 
          type="range" 
          min="0.5" 
          max="5" 
          step="0.5"
          value={speed}
          onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 pt-4">
        <button
          onClick={isRunning ? onPause : onStart}
          className={cn(
            "flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-sm transition-all shadow-sm",
            isRunning 
              ? "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100" 
              : "bg-blue-600 text-white hover:bg-blue-700"
          )}
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={onStep}
          className="flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg font-medium text-sm hover:bg-slate-50 transition-all shadow-sm"
        >
          <ChevronRight className="w-4 h-4" />
          Step
        </button>
        <button
          onClick={onReset}
          className="col-span-2 flex items-center justify-center gap-2 py-2.5 bg-slate-100 text-slate-700 rounded-lg font-medium text-sm hover:bg-slate-200 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Simulation
        </button>
      </div>

      <div className="mt-auto pt-6 border-t border-slate-100">
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
          <div className="flex items-center gap-2 text-blue-700 mb-2">
            <Info className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Tip</span>
          </div>
          <p className="text-[11px] text-blue-600 leading-relaxed">
            Hover over processes or the critical section to see real-time state information and variable values.
          </p>
        </div>
      </div>
    </div>
  );
};
