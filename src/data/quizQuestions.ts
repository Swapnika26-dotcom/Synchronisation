export type QuizLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Question {
  id: number;
  question: string;
  options: string[];
  answer: number;
  type?: 'multiple-choice' | 'programming';
  boilerplate?: string;
  expectedOutput?: string;
  hint?: string;
  level: QuizLevel;
}

export const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "What is the primary purpose of process synchronization?",
    options: ["To prevent memory fragmentation", "To ensure orderly execution of cooperating processes", "To speed up CPU clock cycles", "To increase disk I/O speed"],
    answer: 1,
    level: 'beginner'
  },
  {
    id: 2,
    question: "Which of the following describes a 'race condition'?",
    options: ["Two processes competing for the user's attention", "When the outcome of execution depends on the sequence or timing of other uncontrollable events", "A process that executes faster than others", "A system-wide crash due to high load"],
    answer: 1,
    level: 'beginner'
  },
  {
    id: 3,
    question: "The part of the code where shared memory is accessed is called...",
    options: ["Safe Zone", "Isolation Block", "Critical Section", "Atomic Phase"],
    answer: 2,
    level: 'beginner'
  },
  {
    id: 4,
    question: "Mutual exclusion can be defined as...",
    options: ["If a process is executing in its critical section, no other processes can be executing in their critical sections", "All processes must execute at the same time", "Each process has its own CPU", "Processes cannot access memory at all"],
    answer: 0,
    level: 'beginner'
  },
  {
    id: 5,
    question: "Peterson's algorithm is typically used for how many processes?",
    options: ["Any number of processes", "Only one process", "Exactly two processes", "Exactly three processes"],
    answer: 2,
    level: 'intermediate'
  },
  {
    id: 6,
    question: "What does the 'TestAndSet' instruction do?",
    options: ["Tests a value and sets it to true atomically", "Deletes a block of memory", "Compares two strings", "Increases the priority of a process"],
    answer: 0,
    level: 'intermediate'
  },
  {
    id: 7,
    question: "A semaphore is basically an...",
    options: ["Array of characters", "Integer variable", "Boolean flag", "Float variable"],
    answer: 1,
    level: 'beginner'
  },
  {
    id: 8,
    question: "The 'wait' operation in a semaphore is also known as...",
    options: ["V operation", "S operation", "P operation", "W operation"],
    answer: 2,
    level: 'beginner'
  },
  {
    id: 9,
    question: "The 'signal' operation in a semaphore is also known as...",
    options: ["P operation", "V operation", "A operation", "S operation"],
    answer: 1,
    level: 'beginner'
  },
  {
    id: 10,
    question: "A binary semaphore can take values...",
    options: ["0 and 1 only", "Any integer", "Any negative number", "0 through 10"],
    answer: 0,
    level: 'beginner'
  },
  {
    id: 11,
    question: "Which synchronization problem involves a fixed-size buffer shared by two processes?",
    options: ["Dining Philosophers", "Readers-Writers", "Producer-Consumer", "Deadlock Prevention"],
    answer: 2,
    level: 'intermediate'
  },
  {
    id: 12,
    question: "In the Producer-Consumer problem, what happens if the buffer is full?",
    options: ["The producer is terminated", "The producer must wait until a slot is empty", "The consumer must stop", "The data is overwritten"],
    answer: 1,
    level: 'intermediate'
  },
  {
    id: 13,
    question: "The Dining Philosophers problem mainly illustrates...",
    options: ["The need for more memory", "Resource allocation and deadlock", "Inter-process communication speed", "Network protocols"],
    answer: 1,
    level: 'intermediate'
  },
  {
    id: 14,
    question: "How many forks are required for one philosopher to eat in a 5-philosopher setup?",
    options: ["1 fork", "2 forks", "5 forks", "0 forks"],
    answer: 1,
    level: 'intermediate'
  },
  {
    id: 15,
    question: "In the Readers-Writers problem, multiple ___ can read at the same time.",
    options: ["Writers", "Terminals", "Readers", "Systems"],
    answer: 2,
    level: 'intermediate'
  },
  {
    id: 16,
    question: "In the Readers-Writers problem, if a writer is active...",
    options: ["Multiple readers can read", "Another writer can write", "No other readers or writers can access the file", "The system must restart"],
    answer: 2,
    level: 'intermediate'
  },
  {
    id: 17,
    question: "What is a 'Monitor' in OS?",
    options: ["A hardware screen", "A high-level abstraction for synchronization", "A process that tracks CPU usage", "A software for security"],
    answer: 1,
    level: 'intermediate'
  },
  {
    id: 18,
    question: "What is 'Deadlock'?",
    options: ["A system that is powered off", "A set of processes waiting for events that only other processes in the set can cause", "A single process taking up 100% CPU", "A memory leak"],
    answer: 1,
    level: 'beginner'
  },
  {
    id: 19,
    question: "Which of these is NOT a condition for a deadlock?",
    options: ["Mutual Exclusion", "Circular Wait", "No Preemption", "Strict Order"],
    answer: 3,
    level: 'advanced'
  },
  {
    id: 20,
    question: "The 'Banker's Algorithm' is used for deadlock...",
    options: ["Detection", "Prevention", "Avoidance", "Recovery"],
    answer: 2,
    level: 'advanced'
  },
  {
    id: 21,
    question: "A 'Counting Semaphore' is initialized to...",
    options: ["The number of available resources", "Zero always", "One always", "A negative number"],
    answer: 0,
    level: 'intermediate'
  },
  {
    id: 22,
    question: "What is the 'Hold and Wait' condition for deadlock?",
    options: ["A process holds a resource while waiting for another", "A process is terminated while holding a resource", "Processes must check in every 5 seconds", "Resources are forcedly taken"],
    answer: 0,
    level: 'advanced'
  },
  {
    id: 23,
    question: "The condition 'No Preemption' means...",
    options: ["Processes cannot be interrupted", "Resources cannot be taken from a process holding them", "The CPU never switches tasks", "Users cannot end tasks"],
    answer: 1,
    level: 'advanced'
  },
  {
    id: 24,
    question: "What is 'Starvation' in process management?",
    options: ["A process running out of memory", "A process being indefinitely delayed because others are prioritized", "A process using too much memory", "A slow internet connection"],
    answer: 1,
    level: 'intermediate'
  },
  {
    id: 25,
    question: "A high-level synchronization construct that includes only one active process at a time...",
    options: ["Mutex", "Monitor", "Semaphore", "Spinlock"],
    answer: 1,
    level: 'intermediate'
  },
  {
    id: 26,
    question: "What is an 'Atomic Operation'?",
    options: ["Operation that takes 1 second", "Operation that happens as a single indivisible unit", "Operation involving physics", "A complex multi-step process"],
    answer: 1,
    level: 'beginner'
  },
  {
    id: 27,
    question: "In Peterson's algorithm, what does the 'turn' variable indicate?",
    options: ["Whose turn it is to wait", "Whose turn it is to enter the critical section", "How many cycles have passed", "The process ID"],
    answer: 1,
    level: 'advanced'
  },
  {
    id: 28,
    question: "Which of these is a hardware-based solution for synchronization?",
    options: ["Peterson's Algorithm", "Mutex", "TestAndSet instruction", "Monitor"],
    answer: 2,
    level: 'advanced'
  },
  {
    id: 29,
    question: "A semaphore value becoming negative usually means...",
    options: ["An error occurred", "System crash", "Number of processes blocked on it", "Resource is free"],
    answer: 2,
    level: 'advanced'
  },
  {
    id: 30,
    question: "In the Readers-Writers problem, which prioritization leads to writer starvation?",
    options: ["Reader Priority", "Writer Priority", "Equal Priority", "Random Priority"],
    answer: 0,
    level: 'advanced'
  },
  {
    id: 56,
    question: "Complete the pseudocode for Peterson's Algorithm Entry Section. (Enter exact missing line)",
    options: [],
    answer: 0,
    type: "programming",
    level: "advanced",
    boilerplate: "// Entry Section for Process i\nflag[i] = true;\nturn = j;\nwhile (flag[j] && turn == j) {\n  // What goes here for busy wait?\n}",
    expectedOutput: "// empty"
  },
  {
    id: 57,
    question: "Implement the 'signal' (V) operation for a binary semaphore named 'mutex'.",
    options: [],
    answer: 0,
    type: "programming",
    level: "advanced",
    boilerplate: "void signal(Semaphore mutex) {\n  // Write logic to release mutex\n}",
    expectedOutput: "mutex = 1"
  }
];
