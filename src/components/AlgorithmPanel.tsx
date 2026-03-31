import React from 'react';
import { AlgorithmType } from '../types';
import { ALGORITHM_INFO } from '../constants';
import { cn } from '../lib/utils';
import { Terminal } from 'lucide-react';

interface AlgorithmPanelProps {
  algorithm: AlgorithmType;
  variables: Record<string, any>;
  logs: string[];
}

export const AlgorithmPanel: React.FC<AlgorithmPanelProps> = ({ algorithm, variables, logs }) => {
  const info = ALGORITHM_INFO[algorithm];

  return (
    <div className="bg-white border-l border-slate-200 w-96 flex flex-col h-full overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-sm font-bold text-slate-900 mb-1">{info.name}</h2>
        <p className="text-[11px] text-slate-500 leading-relaxed">{info.description}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="space-y-3">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Pseudocode</h3>
          <div className="bg-slate-900 rounded-lg p-4 font-mono text-[11px] text-slate-300 space-y-1 overflow-x-auto">
            {info.pseudocode.map((line, i) => (
              <div key={i} className="flex gap-4">
                <span className="text-slate-600 w-4 text-right">{i + 1}</span>
                <span className="whitespace-pre">{line}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Shared Variables</h3>
          <div className="grid grid-cols-1 gap-2">
            {Object.entries(variables).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-100">
                <span className="text-[11px] font-mono font-bold text-slate-600">{key}</span>
                <span className="text-[11px] font-mono text-blue-600">
                  {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <Terminal className="w-3 h-3" />
            Event Log
          </h3>
          <div className="space-y-1.5">
            {logs.map((log, i) => (
              <div key={i} className="text-[10px] text-slate-600 border-l-2 border-slate-200 pl-2 py-0.5">
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 bg-slate-50 border-t border-slate-100">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Explanation</h3>
        <ul className="space-y-2">
          {info.explanation.map((exp, i) => (
            <li key={i} className="flex gap-2 text-[10px] text-slate-600 leading-relaxed">
              <span className="text-blue-500 font-bold">•</span>
              {exp}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
