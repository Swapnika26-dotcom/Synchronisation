import { useState } from "react";
import { ALGORITHMS } from "../constants";
import { AlgorithmType } from "../types";
import { Simulator } from "./Simulator";
import { Terminal as TerminalComponent } from "./Terminal";
import { ALGO_CODE_TEMPLATES, getDefaultTemplate } from "../data/codeTemplates";
import { 
  ChevronLeft, 
  BookOpen, 
  Zap, 
  Terminal, 
  ShieldCheck, 
  Cpu,
  Star,
  Binary,
  Code2,
  Layers
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";

export function Academy() {
  const [selectedAlgo, setSelectedAlgo] = useState<AlgorithmType | null>(null);
  const [selectedLang, setSelectedLang] = useState<string>("c");
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);

  const categories = [
    { id: 'software', title: 'Synchronization Algorithms (Software)', subtitle: 'Logic-based solutions without special hardware support.' },
    { id: 'mechanism', title: 'Higher-Level Synchronization Mechanisms', subtitle: 'Abstract tools provided by operating systems and compilers.' },
    { id: 'problem', title: 'Classical Synchronization Problems', subtitle: 'Standard coordination challenges using the above tools.' },
    { id: 'hardware', title: 'Synchronization Algorithms (Hardware)', subtitle: 'Atomic instructions provided by modern CPU architectures.' },
  ];

  if (selectedAlgo) {
    const data = ALGORITHMS.find(a => a.id === selectedAlgo)!;
    const currentCode = ALGO_CODE_TEMPLATES[selectedAlgo]?.[selectedLang] || getDefaultTemplate(selectedAlgo, selectedLang);

    const handleRun = (code: string) => {
      setIsExecuting(true);
      setTerminalOutput([]);
      const startTime = new Date().toLocaleTimeString();
      setTimeout(() => {
        setTerminalOutput([`[sys] Initializing ${selectedLang.toUpperCase()} environment...`]);
        setTimeout(() => {
          setTerminalOutput(prev => [...prev, `[sys] Kernel context: sync_algo_${selectedAlgo}`]);
          setTimeout(() => {
            setTerminalOutput(prev => [
              ...prev, 
              `[stdout] P0 entering entry section...`,
              `[stdout] CS_LOCK acquired.`,
              `[stdout] Executing critical section...`,
              `[stdout] releasing resources...`,
              `[sys] Process terminated at ${startTime}`
            ]);
            setIsExecuting(false);
          }, 1000);
        }, 600);
      }, 400);
    };

    return (
      <div className="space-y-12 pb-20 animate-in fade-in duration-500">
        <button 
          onClick={() => {
            setSelectedAlgo(null);
            setTerminalOutput([]);
          }}
          className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Registry
        </button>

        <section className="grid grid-cols-1 xl:grid-cols-12 gap-12 sm:gap-16">
          <div className="xl:col-span-4 space-y-10">
            <header className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-lg text-[10px] font-black uppercase tracking-widest border border-primary/10">
                <BookOpen className="w-3.5 h-3.5" />
                Theory Module
              </div>
              <h2 className="text-5xl sm:text-7xl font-black tracking-tighter uppercase leading-[0.8]">
                {data.title}
              </h2>
              <p className="text-xl text-muted-foreground font-medium leading-relaxed border-l-2 border-primary/20 pl-6 italic">
                {data.description}
              </p>
            </header>

            <div className="grid grid-cols-1 gap-4">
              {data.properties.map((prop, i) => (
                <div key={i} className="p-6 bg-secondary/30 border border-white/5 rounded-3xl space-y-1 group transition-all hover:bg-secondary/50">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary group-hover:text-primary transition-colors opacity-50 group-hover:opacity-100">
                    {prop.label}
                  </span>
                  <p className="text-lg font-bold text-foreground">
                    {prop.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-primary/5 border border-primary/10 rounded-[2.5rem] p-8 space-y-6">
               <div className="flex items-center gap-2 text-primary">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="text-xs font-black uppercase tracking-[0.2em]">Safety Invariants</span>
               </div>
               <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                    <p className="text-sm font-medium text-muted-foreground leading-relaxed">The ready queue prevents indefinite postponement through strict ordering.</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                    <p className="text-sm font-medium text-muted-foreground leading-relaxed">Mutual exclusion is guaranteed via hardware-assisted atomic context switches.</p>
                  </div>
               </div>
            </div>
          </div>

          <div className="xl:col-span-8 space-y-8">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-500/10 text-green-500 rounded-xl text-[10px] font-black uppercase tracking-widest border border-green-500/20">
                <Zap className="w-4 h-4" />
                Live OS Laboratory
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30 italic">
                Primary Simulation Stage active
              </div>
            </div>
            
            <div className="bg-secondary/20 border-2 border-primary/20 rounded-[3.5rem] p-2 shadow-[0_40px_100px_rgba(0,0,0,0.5)] overflow-hidden group relative">
              <div className="absolute -inset-1 bg-gradient-to-br from-primary/15 to-transparent blur-3xl opacity-20 pointer-events-none" />
              <div className="bg-background rounded-[3.2rem] overflow-hidden border border-border/50 group-hover:border-primary/20 transition-all">
                <Simulator lockedAlgo={selectedAlgo} hideAlgoSelection={true} />
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-24 pb-20 animate-in fade-in duration-700">
      <div className="max-w-4xl space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-2xl text-[10px] font-black uppercase tracking-widest mb-4">
          <Cpu className="w-4 h-4" />
          Algorithm Academy
        </div>
        <h2 className="text-5xl sm:text-8xl font-black tracking-tighter leading-[0.8] uppercase">
          Master Your <br />
          <span className="text-primary italic tracking-normal lowercase font-serif italic text-6xl sm:text-9xl">Synchronization</span>
        </h2>
        <p className="text-xl text-muted-foreground font-medium max-w-2xl leading-relaxed">
          Comprehensive curriculum covering software logic, kernel primitives, classical problems, and hardware-level atomicity.
        </p>
      </div>

      <div className="space-y-32">
        {categories.map((cat) => (
          <div key={cat.id} className="space-y-12">
            <div className="space-y-2">
              <h3 className="text-2xl sm:text-4xl font-black tracking-tight uppercase group flex items-center gap-4">
                <div className="w-2 h-10 bg-primary rounded-full group-hover:h-12 transition-all" />
                {cat.title}
              </h3>
              <p className="text-muted-foreground font-medium">{cat.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {ALGORITHMS.filter(a => a.category === cat.id).map((algo, i) => (
                <motion.button
                  key={algo.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setSelectedAlgo(algo.id)}
                  className="group relative flex flex-col items-start p-8 sm:p-10 bg-card border border-border rounded-[2.5rem] hover:border-primary transition-all text-left shadow-sm hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2 overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-all pointer-events-none">
                    <Star className="w-32 h-32 text-primary" />
                  </div>
                  
                  <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-10 group-hover:bg-primary transition-colors duration-500">
                     {cat.id === 'software' && <Code2 className="w-8 h-8 text-foreground group-hover:text-background" />}
                     {cat.id === 'mechanism' && <Cpu className="w-8 h-8 text-foreground group-hover:text-background" />}
                     {cat.id === 'problem' && <Star className="w-8 h-8 text-foreground group-hover:text-background" />}
                     {cat.id === 'hardware' && <Binary className="w-8 h-8 text-foreground group-hover:text-background" />}
                  </div>

                  <div className="space-y-4 relative z-10">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary opacity-60">
                      Module {cat.id.charAt(0).toUpperCase()}{i + 1}
                    </span>
                    <h3 className="text-2xl font-black tracking-tight leading-none group-hover:text-primary transition-colors">
                      {algo.title}
                    </h3>
                    <p className="text-sm font-medium text-muted-foreground leading-relaxed line-clamp-2">
                      {algo.subtitle}
                    </p>
                  </div>

                  <div className="mt-8 pt-8 border-t border-border/50 w-full flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
                      Enter Module
                    </span>
                    <ShieldCheck className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
