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
  Shield
} from 'lucide-react';

import { Terminal } from './Terminal';

export function Quiz() {
  const [level, setLevel] = useState<QuizLevel | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const filteredQuestions = level ? QUIZ_QUESTIONS.filter(q => q.level === level) : [];

  const handleAnswer = (optionIdx: number) => {
    if (selectedOption !== null) return;

    setSelectedOption(optionIdx);
    const correct = optionIdx === filteredQuestions[currentIdx].answer;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(prev => prev + 2);
    }
  };

  const nextQuestion = async () => {
    const nextIdx = currentIdx + 1;
    if (nextIdx < filteredQuestions.length) {
      setCurrentIdx(nextIdx);
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      setShowResult(true);
    }
  };

  const skipQuestion = async () => {
    const nextIdx = currentIdx + 1;
    if (nextIdx < filteredQuestions.length) {
      setCurrentIdx(nextIdx);
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      setShowResult(true);
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
      { id: 'beginner', title: 'Beginner', desc: 'Fundamentals, race conditions, and basic definitions.', icon: Zap, color: 'bg-green-500' },
      { id: 'intermediate', title: 'Intermediate', desc: 'Peterson, Semaphores, and classic problem logic.', icon: Brain, color: 'bg-blue-500' },
      { id: 'advanced', title: 'Advanced', desc: 'Hardware sync, deadlock conditions, and monitor patterns.', icon: Shield, color: 'bg-primary' },
    ];

    return (
      <div className="space-y-12">
        <div className="max-w-3xl space-y-4">
          <h2 className="text-5xl font-black tracking-tighter uppercase leading-[0.8]">
            Final <br />
            <span className="text-primary italic tracking-normal lowercase font-serif italic text-6xl">Evaluation</span>
          </h2>
          <p className="text-lg text-muted-foreground font-medium max-w-xl">
            Select your rank. Each level tests progressively deeper understanding of OS synchronization primitives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-20">
          {levels.map((l) => (
            <button
              key={l.id}
              onClick={() => setLevel(l.id)}
              className="group p-8 bg-card border border-border rounded-[2.5rem] hover:border-primary transition-all text-left flex flex-col gap-6"
            >
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg", l.color)}>
                <l.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tight mb-2">{l.title}</h3>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed">{l.desc}</p>
              </div>
              <div className="mt-auto pt-6 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Initialize Test</span>
                <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const handleProgramRun = (code: string) => {
    const expected = filteredQuestions[currentIdx].expectedOutput;
    const isActuallyCorrect = code.toLowerCase().includes(expected?.toLowerCase() || "");
    
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
    const percentage = (score / perfectScore) * 100;

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto py-12"
      >
        <div className="bg-card border border-border rounded-[2.5rem] p-10 text-center shadow-xl space-y-8">
          <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-12 h-12 text-primary" />
          </div>
          
          <div>
            <h2 className="text-4xl font-extrabold tracking-tight mb-2">Examination Result</h2>
            <p className="text-muted-foreground uppercase tracking-widest text-[10px] font-black">Level: <span className="text-primary">{level}</span></p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-secondary rounded-2xl border border-border">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Final Score</span>
              <span className="text-3xl font-extrabold text-primary">{score} / {perfectScore}</span>
            </div>
            <div className="p-6 bg-secondary rounded-2xl border border-border">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Accuracy</span>
              <span className="text-3xl font-extrabold text-primary">{percentage.toFixed(0)}%</span>
            </div>
          </div>

          <button
            onClick={resetQuiz}
            className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/20"
          >
            <RotateCcw className="w-5 h-5" />
            Finish & Return
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 lg:py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setLevel(null)}
            className="w-10 h-10 bg-secondary border border-border rounded-xl flex items-center justify-center hover:bg-accent transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight underline decoration-primary/30 decoration-4 underline-offset-4">Knowledge Check</h1>
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest">Q: {currentIdx + 1} of {filteredQuestions.length} • {level}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-right">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block">Current Score</span>
              <span className="text-lg font-mono font-bold text-primary">{score}</span>
           </div>
           <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <BrainCircuit className="w-6 h-6 text-primary-foreground" />
           </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Progress Bar */}
        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden border border-border">
          <motion.div 
            className="h-full bg-primary"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-card border border-border rounded-3xl p-8 sm:p-10 shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
            
            <h2 className="text-xl sm:text-2xl font-bold mb-10 leading-relaxed relative">
              {question.question}
            </h2>

            {question.type === 'programming' ? (
              <div className="space-y-6 relative">
                 <div className="flex items-center gap-2 p-3 bg-primary/5 border border-primary/20 rounded-xl text-xs text-muted-foreground">
                    <Info className="w-4 h-4 text-primary" />
                    <span>Type your solution in the terminal and click Execute to verify.</span>
                 </div>
                 <Terminal 
                   boilerplate={question.boilerplate || ""} 
                   onRun={handleProgramRun} 
                 />
                 {selectedOption === 99 && (
                   <motion.div 
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     className={cn(
                       "p-4 rounded-xl flex items-center gap-3",
                       isCorrect ? "bg-green-500/10 text-green-600" : "bg-destructive/10 text-destructive"
                     )}
                   >
                     {isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                     <span className="text-sm font-bold">
                       {isCorrect ? "Correct! Well implemented." : "Not quite. Check your logic and try Execute again."}
                     </span>
                   </motion.div>
                 )}
              </div>
            ) : (
              <div className="space-y-4 relative">
                {question.options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const showCorrect = selectedOption !== null && idx === question.answer;
                  const showWrong = isSelected && !isCorrect;

                  return (
                    <button
                      key={idx}
                      disabled={selectedOption !== null}
                      onClick={() => handleAnswer(idx)}
                      className={cn(
                        "w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center justify-between group",
                        selectedOption === null 
                          ? "border-border hover:border-primary/50 hover:bg-accent" 
                          : showCorrect
                          ? "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400"
                          : showWrong
                          ? "border-destructive bg-destructive/10 text-destructive"
                          : "border-border opacity-50"
                      )}
                    >
                      <span className="font-semibold">{option}</span>
                      {showCorrect && <CheckCircle2 className="w-5 h-5" />}
                      {showWrong && <XCircle className="w-5 h-5" />}
                    </button>
                  );
                })}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              {selectedOption === null && (
                <button
                  onClick={skipQuestion}
                  className="flex-1 py-4 bg-secondary text-secondary-foreground border border-border rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-accent transition-all"
                >
                  <FastForward className="w-5 h-5" />
                  Skip Question
                </button>
              )}

              {selectedOption !== null && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex-1"
                >
                  <button
                    onClick={nextQuestion}
                    className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-primary/20"
                  >
                    {currentIdx === QUIZ_QUESTIONS.length - 1 ? "Finish Quiz" : "Next Question"}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
