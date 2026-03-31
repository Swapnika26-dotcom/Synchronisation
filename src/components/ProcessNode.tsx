import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Process, ProcessState } from '../types';
import { cn } from '../lib/utils';

interface ProcessNodeProps {
  process: Process;
  isWaiting: boolean;
  isInCS: boolean;
}

const STATE_COLORS: Record<ProcessState, string> = {
  NEW: 'bg-slate-200',
  READY: 'bg-blue-100 border-blue-400 text-blue-700',
  RUNNING: 'bg-green-100 border-green-400 text-green-700',
  WAITING: 'bg-amber-100 border-amber-400 text-amber-700',
  TERMINATED: 'bg-slate-100 border-slate-300 text-slate-400'
};

export const ProcessNode: React.FC<ProcessNodeProps> = ({ process, isWaiting, isInCS }) => {
  return (
    <motion.div
      layout
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        x: isInCS ? 0 : isWaiting ? -150 : -300,
        y: process.id * 60 - 100
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={cn(
        "absolute w-32 h-12 rounded-lg border-2 flex items-center justify-between px-3 shadow-sm transition-colors group cursor-help",
        STATE_COLORS[process.state]
      )}
    >
      <div className="flex flex-col">
        <span className="text-xs font-bold">{process.label}</span>
        <span className="text-[10px] uppercase tracking-wider opacity-70">{process.state}</span>
      </div>
      
      {process.state === 'RUNNING' && (
        <div className="w-8 h-1 bg-slate-200 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-green-500"
            initial={{ width: 0 }}
            animate={{ width: `${process.progress}%` }}
          />
        </div>
      )}

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-3 bg-slate-800 text-white text-[10px] rounded-xl shadow-xl z-50 pointer-events-none">
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-400 uppercase tracking-tighter">State</span>
            <span className="font-bold">{process.state}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 uppercase tracking-tighter">Wait Time</span>
            <span className="font-bold">{process.waitingTime}s</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 uppercase tracking-tighter">Progress</span>
            <span className="font-bold">{Math.round(process.progress)}%</span>
          </div>
        </div>
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-800" />
      </div>
    </motion.div>
  );
};
