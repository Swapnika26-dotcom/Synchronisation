import { useState } from 'react';
import { ALGORITHMS } from '../constants';
import { SYNCHRONIZATION_THEORY, SYNCHRONIZATION_FUNDAMENTALS } from '../data/theoryData';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Code2, Info, CheckCircle2, BookOpen, Star } from 'lucide-react';

export function Concepts() {
  const [selectedId, setSelectedId] = useState(ALGORITHMS[0].id);
  const selected = ALGORITHMS.find(a => a.id === selectedId)!;

  return (
    <div className="space-y-24 py-8 lg:py-12">
      {/* Introduction */}
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-widest">
          <BookOpen className="w-3.5 h-3.5" />
          The Knowledge Base
        </div>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight">Synchronization <span className="text-primary italic">Mechanisms</span></h1>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Deep dive into the theoretical foundations and implementation logic of classic synchronization algorithms.
        </p>
      </div>

      {/* DETAILED FUNDAMENTALS (Moved from Hero) */}
      <div className="space-y-12">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Star className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-2xl font-black tracking-tight uppercase tracking-widest">01. Fundamentals</h2>
          </div>
          <span className="text-xs font-bold text-muted-foreground">Theory & Definitions</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {SYNCHRONIZATION_FUNDAMENTALS.map((fundamental, i) => (
            <motion.div
              key={fundamental.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "relative group bg-card border border-border rounded-[2.5rem] p-8 transition-all hover:shadow-2xl hover:shadow-primary/10",
                fundamental.id === 'race-condition-detailed' && "lg:col-span-2 bg-primary/5 border-primary/20",
                fundamental.id === 'real-life' && "lg:col-span-1 bg-secondary/30"
              )}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 bg-background rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                  <fundamental.icon className="w-7 h-7" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 font-mono">MOD_0{i + 1}</span>
              </div>

              <h3 className="text-2xl font-black mb-4 tracking-tight group-hover:text-primary transition-colors">{fundamental.title}</h3>
              <p className="text-muted-foreground leading-relaxed mb-8 text-sm">
                {fundamental.content}
              </p>

              {fundamental.subsections && (
                <div className="space-y-6">
                  {fundamental.subsections.map((sub, si) => (
                    <div key={si} className="space-y-3">
                      <h4 className="text-sm font-bold flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {sub.title}
                      </h4>
                      {sub.content && <p className="text-[13px] text-muted-foreground/80 pl-3.5 leading-relaxed italic">{sub.content}</p>}
                      {sub.list && sub.list.length > 0 && (
                        <div className="pl-3.5 space-y-2">
                          {sub.list.map((item, li) => (
                            <div key={li} className="flex items-start gap-3 text-xs bg-background/50 p-3 rounded-xl border border-border/50 group-hover:border-primary/20 transition-all">
                              <CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                              <span className={cn("font-medium", item.includes('👉') && "text-primary font-bold")}>{item}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* ALGORITHM MECHANICS */}
      <div className="space-y-12">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Code2 className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-2xl font-black tracking-tight uppercase tracking-widest">02. Algorithms</h2>
          </div>
          <span className="text-xs font-bold text-muted-foreground">Formal Mechanisms</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Sidebar */}
          <div className="lg:col-span-3 space-y-3">
            {ALGORITHMS.map((algo) => (
              <button
                key={algo.id}
                onClick={() => setSelectedId(algo.id)}
                className={cn(
                  "w-full text-left px-5 py-4 rounded-2xl transition-all flex items-center justify-between group border-2",
                  selectedId === algo.id
                    ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "border-transparent hover:bg-accent text-muted-foreground hover:text-foreground"
                )}
              >
                <span className="font-bold tracking-tight">{algo.title}</span>
                {selectedId === algo.id && <CheckCircle2 className="w-4 h-4" />}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="bg-card border-2 border-border rounded-[2.5rem] p-8 sm:p-12 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />
                  
                  <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 mb-12 relative z-10">
                    <div>
                      <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-3">
                        {selected.title}
                      </h1>
                      <p className="text-primary font-bold text-lg uppercase tracking-wider">{selected.subtitle}</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {selected.properties.map((prop, i) => (
                        <div key={i} className="px-5 py-2.5 bg-secondary/80 rounded-2xl border border-primary/10 shadow-sm backdrop-blur-sm">
                          <span className="text-[10px] font-black text-primary/60 uppercase block leading-none mb-1.5 tracking-widest font-mono">
                            {prop.label}
                          </span>
                          <span className="text-sm font-black">{prop.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                    <div className="space-y-8">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <Info className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-black mb-3 italic">Technical Specification</h3>
                          <p className="text-muted-foreground leading-relaxed text-sm lg:text-base">
                            {selected.description}
                          </p>
                        </div>
                      </div>

                      <div className="p-8 bg-zinc-900/5 dark:bg-zinc-100/5 rounded-[2rem] border border-border/50 space-y-4">
                        <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Key Security Properties</h4>
                        <ul className="space-y-4">
                          {[
                            "Atomic entry/exit protocols.",
                            "Strict mutual exclusion handling.",
                            "Resistance to deadlock scenarios.",
                            "Optimized for low context-switch overhead."
                          ].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm font-bold">
                              <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                              </div>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Code2 className="w-5 h-5 text-primary" />
                          <h3 className="font-black italic">Logic Definition</h3>
                        </div>
                        <span className="text-[10px] font-mono text-muted-foreground">ISO Standard Compliance</span>
                      </div>
                      <div className="bg-zinc-950 rounded-[2rem] p-8 overflow-x-auto border border-zinc-800 shadow-2xl relative">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                          <Code2 className="w-24 h-24 text-white" />
                        </div>
                        <pre className="text-zinc-300 font-mono text-sm leading-relaxed relative z-10">
                          <code>{selected.pseudocode}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* QUICK REFERENCE SUMMARY */}
      <div className="pt-24 border-t border-border">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black tracking-tight mb-4">Quick <span className="text-primary italic">Reference</span></h2>
          <p className="text-muted-foreground">Snapshot of algorithm comparisons</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SYNCHRONIZATION_THEORY.map((concept, i) => (
            <div key={concept.id} className="p-8 bg-secondary/30 rounded-3xl border border-border hover:bg-card transition-all">
              <concept.icon className="w-8 h-8 text-primary mb-6" />
              <h4 className="text-lg font-bold mb-3">{concept.title}</h4>
              <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{concept.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {concept.points.slice(0, 2).map((p, j) => (
                  <span key={j} className="px-2 py-0.5 bg-primary/10 text-primary text-[8px] font-black uppercase rounded-full">{p}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
