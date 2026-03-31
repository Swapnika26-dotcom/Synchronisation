import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle, RotateCcw, Trophy } from 'lucide-react';
import { cn } from '../lib/utils';

const QUESTIONS = [
  {
    id: 1,
    question: "Which requirement for a critical section solution ensures that no other process can enter the critical section if one is already there?",
    options: ["Progress", "Bounded Waiting", "Mutual Exclusion", "Deadlock Prevention"],
    answer: 2
  },
  {
    id: 2,
    question: "In Peterson's algorithm, what is the purpose of the 'turn' variable?",
    options: ["To signal intent to enter", "To break ties when both processes want to enter", "To count the number of processes", "To lock the shared resource"],
    answer: 1
  },
  {
    id: 3,
    question: "What is a binary semaphore?",
    options: ["A semaphore that can take any integer value", "A semaphore that can only take values 0 and 1", "A semaphore used for counting resources", "A semaphore that causes deadlocks"],
    answer: 1
  },
  {
    id: 4,
    question: "Which problem involves five philosophers sitting at a table?",
    options: ["Producer-Consumer", "Readers-Writers", "Dining Philosophers", "Sleeping Barber"],
    answer: 2
  },
  {
    id: 5,
    question: "What occurs when multiple processes wait indefinitely for resources held by each other?",
    options: ["Race Condition", "Starvation", "Deadlock", "Mutual Exclusion"],
    answer: 2
  }
];

export default function QuizPage() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    if (index === QUESTIONS[currentQuestion].answer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <header className="h-16 border-b border-slate-200 bg-white flex items-center px-8 sticky top-0 z-10">
        <button 
          onClick={() => navigate('/')}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 mr-4"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-slate-900">Knowledge Quiz</h1>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div 
              key="quiz"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="max-w-2xl w-full bg-white p-12 rounded-3xl border border-slate-200 shadow-xl space-y-8"
            >
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Question {currentQuestion + 1} of {QUESTIONS.length}</span>
                <div className="h-1.5 w-32 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-blue-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestion + 1) / QUESTIONS.length) * 100}%` }}
                  />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 leading-tight">
                {QUESTIONS[currentQuestion].question}
              </h2>

              <div className="space-y-3">
                {QUESTIONS[currentQuestion].options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => handleOptionClick(i)}
                    disabled={isAnswered}
                    className={cn(
                      "w-full p-4 text-left rounded-2xl border-2 transition-all flex items-center justify-between group",
                      !isAnswered && "border-slate-100 hover:border-blue-500 hover:bg-blue-50",
                      isAnswered && i === QUESTIONS[currentQuestion].answer && "border-emerald-500 bg-emerald-50",
                      isAnswered && selectedOption === i && i !== QUESTIONS[currentQuestion].answer && "border-red-500 bg-red-50",
                      isAnswered && i !== QUESTIONS[currentQuestion].answer && selectedOption !== i && "opacity-50 border-slate-100"
                    )}
                  >
                    <span className="font-medium text-slate-700">{option}</span>
                    {isAnswered && i === QUESTIONS[currentQuestion].answer && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                    {isAnswered && selectedOption === i && i !== QUESTIONS[currentQuestion].answer && <XCircle className="w-5 h-5 text-red-500" />}
                  </button>
                ))}
              </div>

              {isAnswered && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={handleNext}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all"
                >
                  {currentQuestion === QUESTIONS.length - 1 ? 'Finish Quiz' : 'Next Question'}
                </motion.button>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md w-full bg-white p-12 rounded-3xl border border-slate-200 shadow-xl text-center space-y-8"
            >
              <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                <Trophy className="w-12 h-12" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-slate-900">Quiz Complete!</h2>
                <p className="text-slate-500">You scored {score} out of {QUESTIONS.length}</p>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={resetQuiz}
                  className="flex-1 py-4 bg-slate-100 text-slate-700 rounded-2xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  Try Again
                </button>
                <button 
                  onClick={() => navigate('/')}
                  className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all"
                >
                  Back Home
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="py-12 border-t border-slate-200 text-center bg-white">
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
          SyncVisual Assessment Module
        </p>
      </footer>
    </div>
  );
}
