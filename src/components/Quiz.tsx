import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QUIZ_QUESTIONS, QuizLevel } from '../data/quizQuestions';
import { cn } from '../lib/utils';
import { 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw,
  GraduationCap,
  BrainCircuit,
  Award,
  FastForward,
  Info,
  ChevronLeft,
  Zap,
  Brain,
  Shield,
  Lock,
  Search,
  Code,
  Star,
  BookOpen
} from 'lucide-react';

import { Terminal } from './Terminal';

interface QuizProps {
  completedLevels: number[];
  onCompleteLevel: (level: number) => void;
}

export function Quiz({ completedLevels, onCompleteLevel }: QuizProps) {
  const [level, setLevel] = useState<QuizLevel | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [conceptsReadCount, setConceptsReadCount] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('concepts_read');
    if (saved) {
      setConceptsReadCount(JSON.parse(saved).length);
    }
  }, []);

  const filteredQuestions = level ? QUIZ_QUESTIONS.filter(q => q.level === level) : [];

  const handleAnswer = (optionIdx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(optionIdx);
    const correct = optionIdx === filteredQuestions[currentIdx].answer;
    setIsCorrect(correct);
    if (correct) setScore(prev => prev + 2);
  };

  const nextQuestion = () => {
    const nextIdx = currentIdx + 1;
    if (nextIdx < filteredQuestions.length) {
      setCurrentIdx(nextIdx);
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      setShowResult(true);
      if (score + (isCorrect ? 2 : 0) >= (filteredQuestions.length * 2 * 0.7)) {
        onCompleteLevel(level!);
      }
    }
  };

  const resetQuiz = () => {
    setCurrentIdx(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
    setIsCorrect(null);
    setLevel(null);
  };

  if (!level) {
    const levels: { id: QuizLevel; title: string, desc: string, icon: any, color: string }[] = [
      { id: 1, title: 'Lvl 1: Basics', desc: 'Core definitions and process synchronization fundamentals.', icon: GraduationCap, color: 'bg-emerald-500' },
      { id: 2, title: 'Lvl 2: Detection', desc: 'Identify algorithms using abstract clues and logic snapshots.', icon: Search, color: 'bg-blue-500' },
      { id: 3, title: 'Lvl 3: Syntax', desc: 'Complete algorithm pseudocode and critical wait logic.', icon: BrainCircuit, color: 'bg-violet-500' },
      { id: 4, title: 'Lvl 4: Developer', desc: 'Solve real-time implementation challenges in the terminal.', icon: Code, color: 'bg-amber-500' },
      { id: 5, title: 'Lvl 5: Master', desc: 'The Grand Finale covering all kernel synchronization concepts.', icon: Star, color: 'bg-primary' },
    ];

    const conceptsRequired = 3;
    const canAttemptQuiz = conceptsReadCount >= conceptsRequired;

    return (
      <div className="space-y-12">
        <div className="max-w-3xl space-y-4">
          <h2 className="page-heading">
             Professional <br />
            <span className="text-primary italic">Certification</span>
          </h2>
          <p className="text-base text-muted-foreground font-medium max-w-xl">
            To unlock the exam, you must first read at least <span className="text-foreground font-bold underline">{conceptsRequired}</span> fundamental concepts in the Academy.
          </p>
          
          <div className="inline-flex items-center gap-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
             <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
             </div>
             <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Study Progress</p>
                <div className="flex items-center gap-2">
                   <p className="text-lg font-bold">{conceptsReadCount} / {conceptsRequired}</p>
                   <span className="text-xs text-muted-foreground">concepts explored</span>
                </div>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
          {levels.map((l) => {
            const isUnlocked = l.id === 1 ? canAttemptQuiz : completedLevels.includes(l.id - 1);
            const isCompleted = completedLevels.includes(l.id);

            return (
              <button
                key={l.id}
                disabled={!isUnlocked}
                onClick={() => setLevel(l.id)}
                className={cn(
                  "group p-8 border rounded-[2.5rem] transition-all text-left flex flex-col gap-6 relative overflow-hidden",
                  isUnlocked 
                    ? "bg-card border-border hover:border-primary animate-in fade-in slide-in-from-bottom-4" 
                    : "bg-secondary/20 border-transparent opacity-60 grayscale cursor-not-allowed"
                )}
              >
                {!isUnlocked && (
                  <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] flex items-center justify-center z-10">
                     <Lock className="w-10 h-10 text-muted-foreground/30" />
                  </div>
                )}
                
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg", 
                  isUnlocked ? l.color : "bg-muted-foreground/20"
                )}>
                  <l.icon className="w-6 h-6" />
                </div>
                
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tight mb-2 flex items-center gap-2">
                    {l.title}
                    {isCompleted && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed">{l.desc}</p>
                </div>

                <div className="mt-auto pt-6 flex items-center justify-between">
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-widest",
                    isUnlocked ? "text-primary" : "text-muted-foreground"
                  )}>
                    {isCompleted ? "Retry Level" : isUnlocked ? "Initialize Test" : "Level Locked"}
                  </span>
                  <ArrowRight className={cn(
                    "w-4 h-4 transition-transform",
                    isUnlocked ? "text-primary group-hover:translate-x-1" : "text-muted-foreground"
                  )} />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const handleProgramRun = (code: string) => {
    const expected = filteredQuestions[currentIdx].expectedOutput;
    const isActuallyCorrect = code.toLowerCase().replace(/\s/g, '').includes(expected?.toLowerCase().replace(/\s/g, '') || "");
    
    setSelectedOption(99); 
    setIsCorrect(isActuallyCorrect);
    if (isActuallyCorrect) {
      setScore(prev => prev + 5);
    }
  };

  const question = filteredQuestions[currentIdx];
  const progress = ((currentIdx + 1) / filteredQuestions.length) * 100;

  if (showResult) {
    const perfectScore = filteredQuestions.length * 2;
    const passThreshold = perfectScore * 0.7;
    const passed = score >= passThreshold;

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto py-12"
      >
        <div className="bg-card border-2 border-border rounded-[3.5rem] p-12 text-center shadow-2xl space-y-8 relative overflow-hidden">
          {passed && (
            <div className="absolute inset-0 pointer-events-none opacity-10">
               <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--primary)_0%,_transparent_70%)]" />
            </div>
          )}

          <div className={cn(
            "w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl",
            passed ? "bg-primary text-primary-foreground shadow-primary/20" : "bg-muted text-muted-foreground"
          )}>
            {passed ? <Award className="w-12 h-12" /> : <Shield className="w-12 h-12" />}
          </div>
          
          <div>
            <h2 className="text-5xl font-black tracking-tighter mb-2">
              {passed ? "Level Mastered" : "Test Failed"}
            </h2>
            <p className="text-muted-foreground uppercase tracking-widest text-xs font-black">Examination Grade: <span className="text-primary">Phase {level}</span></p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="p-8 bg-secondary/50 rounded-3xl border border-border">
              <span className="text-[10px] font-black text-muted-foreground uppercase block mb-2">Total Score</span>
              <span className="text-5xl font-black text-primary">{score}</span>
            </div>
            <div className="p-8 bg-secondary/50 rounded-3xl border border-border text-left">
              <span className="text-[10px] font-black text-muted-foreground uppercase block mb-2">Status</span>
              <p className="font-bold leading-tight">
                {passed 
                  ? "Next level access granted. Authorization synchronized." 
                  : `Score ${score}/${perfectScore} is below threshold. Review Academy files.`}
              </p>
            </div>
          </div>

          <button
            onClick={resetQuiz}
            className="w-full py-5 bg-foreground text-background rounded-2xl font-black uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-3"
          >
            <RotateCcw className="w-5 h-5" />
            Return to Directory
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setLevel(null)}
            className="w-12 h-12 bg-secondary border border-border rounded-2xl flex items-center justify-center hover:bg-accent transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-muted-foreground" />
          </button>
          <div className="h-10 w-[2px] bg-border mx-2" />
          <div>
            <h1 className="text-3xl font-black tracking-tight">Active Evaluation</h1>
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest leading-none">Kernel Tier: {level}</p>
          </div>
        </div>
        <div className="text-right">
           <span className="text-[10px] font-black text-muted-foreground uppercase block mb-1">Session Score</span>
           <div className="px-4 py-2 bg-primary/10 rounded-xl border border-primary/20 text-xl font-black text-primary">
              {score}
           </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-primary"
            animate={{ width: `${progress}%` }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-card border border-border rounded-[2.5rem] p-10 sm:p-12 shadow-sm relative overflow-hidden"
          >
            {question.clue && (
              <div className="mb-8 p-6 bg-blue-500/10 border border-blue-500/20 rounded-3xl flex gap-4">
                 <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shrink-0">
                    <Search className="w-5 h-5 text-white" />
                 </div>
                 <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-widest text-blue-500">Signal Trace / Clue</p>
                    <p className="text-sm font-medium text-muted-foreground leading-relaxed">{question.clue}</p>
                 </div>
              </div>
            )}

            <h2 className="text-2xl sm:text-3xl font-black mb-12 leading-none tracking-tight">
              {question.question}
            </h2>

            {question.type === 'programming' ? (
              <div className="space-y-6">
                 <div className="flex items-center gap-2 p-4 bg-primary/5 border border-primary/20 rounded-2xl text-[11px] font-bold text-muted-foreground italic">
                    <Info className="w-5 h-5 text-primary" />
                    Complete the logic below. Matches are case and space insensitive.
                 </div>
                 <Terminal 
                   boilerplate={question.boilerplate || ""} 
                   onRun={handleProgramRun} 
                 />
                 {selectedOption === 99 && (
                   <div className={cn(
                     "p-6 rounded-2xl border-2 flex items-center gap-4",
                     isCorrect ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600" : "bg-destructive/10 border-destructive/20 text-destructive"
                   )}>
                     {isCorrect ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                     <div>
                       <p className="text-sm font-black uppercase tracking-widest">{isCorrect ? "Unit Test Passed" : "Runtime Error"}</p>
                       <p className="text-xs font-medium opacity-80">{isCorrect ? "Correct synchronization logic detected." : "Unexpected output. Check your entry/exit sections."}</p>
                     </div>
                   </div>
                 )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {question.options.map((option, idx) => (
                  <button
                    key={idx}
                    disabled={selectedOption !== null}
                    onClick={() => handleAnswer(idx)}
                    className={cn(
                      "w-full text-left p-6 rounded-2xl border-2 transition-all flex items-center justify-between group",
                      selectedOption === null 
                        ? "border-border hover:border-primary/50 hover:bg-secondary/50" 
                        : idx === question.answer
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-700"
                        : selectedOption === idx
                        ? "border-destructive bg-destructive/10 text-destructive"
                        : "border-border opacity-40"
                    )}
                  >
                    <span className="font-bold text-lg">{option}</span>
                    {selectedOption !== null && idx === question.answer && <CheckCircle2 className="w-6 h-6 text-emerald-500" />}
                    {selectedOption === idx && idx !== question.answer && <XCircle className="w-6 h-6 text-destructive" />}
                  </button>
                ))}
              </div>
            )}

            <div className="mt-12 flex justify-end">
              {selectedOption !== null && (
                <button
                  onClick={nextQuestion}
                  className="px-10 py-5 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-primary/20 flex items-center gap-3"
                >
                  {currentIdx === filteredQuestions.length - 1 ? "Complete Exam" : "Next Segment"}
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
