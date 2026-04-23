export type QuizLevel = 1 | 2 | 3 | 4 | 5;

export interface Question {
  id: number;
  question: string;
  options: string[];
  answer: number;
  type?: 'multiple-choice' | 'programming' | 'fill-blank';
  boilerplate?: string;
  expectedOutput?: string;
  hint?: string;
  level: QuizLevel;
  clue?: string;
}

export const QUIZ_QUESTIONS: Question[] = [
  // LEVEL 1: DEFINITIONS & BASICS
  {
    id: 101,
    question: "Which of the following best defines 'Mutual Exclusion'?",
    options: [
      "Blocking interrupts system-wide",
      "Only one process can execute in its critical section at a time",
      "All processes must exit simultaneously",
      "Processes sharing all variables at once"
    ],
    answer: 1,
    level: 1
  },
  {
    id: 102,
    question: "A 'Race Condition' occurs when...",
    options: [
      "The final outcome depends on the non-deterministic interleaving of process execution",
      "A process runs faster than the CPU clock speed",
      "Memory is corrupted by physical hardware damage",
      "The OS fails to boot due to a disk error"
    ],
    answer: 0,
    level: 1
  },
  {
    id: 103,
    question: "A solution to the Critical Section problem must satisfy which three requirements?",
    options: [
      "Speed, Memory, Storage",
      "Efficiency, Scalability, Portability",
      "Mutual Exclusion, Progress, Bounded Waiting",
      "Atomicity, Consistency, Isolation"
    ],
    answer: 2,
    level: 1
  },
  {
    id: 104,
    question: "In the context of synchronization, what is a 'Critical Section'?",
    options: [
      "The boot block of a hard drive",
      "The section of code where a process modifies shared data",
      "A period of high CPU usage",
      "A crash-prone region of the kernel"
    ],
    answer: 1,
    level: 1
  },

  // LEVEL 2: ALGORITHMS & CLUES
  {
    id: 201,
    question: "Identify the algorithm: It uses a 'flag' array and a 'turn' variable to coordinate processes.",
    clue: "This algorithm is the standard software benchmark for 2-process mutual exclusion.",
    options: ["Dekker's", "Peterson's", "Lamport's", "Bakery"],
    answer: 1,
    level: 2
  },
  {
    id: 202,
    question: "Identify the algorithm: It provides mutual exclusion for N-processes using a numbered ticketing system.",
    clue: "Think of a customer service queue where you take a number to be served.",
    options: ["Mutex", "Semaphores", "Bakery Algorithm", "Monitors"],
    answer: 2,
    level: 2
  },
  {
    id: 203,
    question: "Identify the mechanism: It is a high-level construct that encapsulates shared data and provides automatic mutual exclusion.",
    clue: "It is often implemented with compiler support, like in Java.",
    options: ["Semaphore", "Monitor", "Spinlock", "Peterson's"],
    answer: 1,
    level: 2
  },

  // LEVEL 3: MISSING PARTS (FILL IN THE BLANK / SYNTAX)
  {
    id: 301,
    question: "Complete the Peterson's busy-wait condition: while(flag[j] && turn == ___);",
    options: ["i", "j", "0", "1"],
    answer: 1,
    level: 3
  },
  {
    id: 302,
    question: "Complete the atomic Wait(S) logic for a semaphore: while(S <= 0); S___;",
    options: ["++", "--", "+=2", "=0"],
    answer: 1,
    level: 3
  },
  {
    id: 303,
    question: "To exit a critical section in Peterson's, what value is assigned to the process's flag: flag[i] = ___ ;",
    options: ["true", "false", "turn", "null"],
    answer: 1,
    level: 3
  },

  // LEVEL 4: TERMINAL CHALLENGES (PROGRAMMING)
  {
    id: 401,
    question: "Implement the 'Exit Section' for a mutex-based synchronization logic.",
    options: [],
    answer: 0,
    type: "programming",
    level: 4,
    boilerplate: "// Entry Section\nmutex.acquire();\n\n// Critical Section\nshared_counter++;\n\n// EXIT SECTION: code goes here\n",
    expectedOutput: "mutex.release()"
  },
  {
    id: 402,
    question: "Write the atomic increment logic for a Semaphore's signal operation.",
    options: [],
    answer: 0,
    type: "programming",
    level: 4,
    boilerplate: "void signal(int *S) {\n  // Atomic operation to release resource\n}",
    expectedOutput: "*S = *S + 1"
  },
  {
    id: 403,
    question: "Define the start of Peterson's entry section (Setting intent).",
    options: [],
    answer: 0,
    type: "programming",
    level: 4,
    boilerplate: "// Process i wants to enter\n// What code indicates intent to enter?",
    expectedOutput: "flag[i] = true"
  },

  // LEVEL 5: GRAND FINALE (COMPREHENSIVE)
  {
    id: 501,
    question: "What happens in a 'Deadlock' state?",
    options: [
      "A process runs in an infinite loop",
      "Two or more processes are waiting indefinitely for events that can only be caused by the waiting processes",
      "The CPU usage hits 100% andstays there",
      "A process crashes due to a null pointer"
    ],
    answer: 1,
    level: 5
  },
  {
    id: 502,
    question: "In the Bounded-Buffer problem, why is a mutex used alongside 'empty' and 'full' semaphores?",
    options: [
      "To count the items in the buffer",
      "To provide mutual exclusion for buffer modification",
      "To signal when the buffer is empty",
      "To increase the speed of context switching"
    ],
    answer: 1,
    level: 5
  },
  {
    id: 503,
    question: "Which hardware instruction can be used to implement a lock by atomically checking and updating a memory bit?",
    options: ["Load-Linked", "Compare-and-Swap", "Test-and-Set", "All of the above"],
    answer: 3,
    level: 5
  }
];
