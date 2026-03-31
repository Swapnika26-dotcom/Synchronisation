import { AlgorithmType } from './types';

export const ALGORITHM_INFO: Record<AlgorithmType, {
  name: string;
  description: string;
  pseudocode: string[];
  explanation: string[];
}> = {
  PETERSON: {
    name: "Peterson's Algorithm",
    description: "A classic software-based solution to the critical section problem for two processes.",
    pseudocode: [
      "flag[i] = true;",
      "turn = j;",
      "while (flag[j] && turn == j);",
      "// Critical Section",
      "flag[i] = false;"
    ],
    explanation: [
      "Process i signals intent to enter.",
      "Process i gives turn to process j.",
      "Wait if j wants to enter and it's j's turn.",
      "Execute critical section logic.",
      "Signal that process i is finished."
    ]
  },
  MUTEX: {
    name: "Mutex Locks",
    description: "A hardware-supported synchronization tool that provides mutual exclusion.",
    pseudocode: [
      "acquire(mutex);",
      "// Critical Section",
      "release(mutex);"
    ],
    explanation: [
      "Attempt to lock the mutex. Block if already locked.",
      "Safe access to shared resource.",
      "Unlock the mutex for others."
    ]
  },
  BINARY_SEMAPHORE: {
    name: "Binary Semaphore",
    description: "Similar to a mutex, but can be used for signaling between processes.",
    pseudocode: [
      "wait(S);",
      "// Critical Section",
      "signal(S);"
    ],
    explanation: [
      "Decrement S. If S < 0, block.",
      "Access shared resource.",
      "Increment S. If S <= 0, wake a process."
    ]
  },
  COUNTING_SEMAPHORE: {
    name: "Counting Semaphore",
    description: "Controls access to a finite number of instances of a resource.",
    pseudocode: [
      "wait(S);",
      "// Critical Section",
      "signal(S);"
    ],
    explanation: [
      "Wait if no resource instances available.",
      "Use one instance of the resource.",
      "Release the resource instance."
    ]
  },
  PRODUCER_CONSUMER: {
    name: "Producer-Consumer",
    description: "Classic problem of synchronizing a producer and a consumer sharing a buffer.",
    pseudocode: [
      "wait(empty);",
      "wait(mutex);",
      "// Add to buffer",
      "signal(mutex);",
      "signal(full);"
    ],
    explanation: [
      "Wait for space in buffer.",
      "Lock buffer access.",
      "Place item in buffer.",
      "Unlock buffer.",
      "Signal item is available."
    ]
  },
  DINING_PHILOSOPHERS: {
    name: "Dining Philosophers",
    description: "Five philosophers sitting at a table, needing two chopsticks to eat.",
    pseudocode: [
      "wait(chopstick[i]);",
      "wait(chopstick[(i+1)%5]);",
      "// Eat",
      "signal(chopstick[i]);",
      "signal(chopstick[(i+1)%5]);"
    ],
    explanation: [
      "Pick up left chopstick.",
      "Pick up right chopstick.",
      "Eat for a while.",
      "Put down left chopstick.",
      "Put down right chopstick."
    ]
  },
  READERS_WRITERS: {
    name: "Readers-Writers",
    description: "Multiple readers can read simultaneously, but only one writer can write.",
    pseudocode: [
      "wait(mutex);",
      "read_count++;",
      "if (read_count == 1) wait(rw_mutex);",
      "signal(mutex);",
      "// Reading...",
      "wait(mutex);",
      "read_count--;",
      "if (read_count == 0) signal(rw_mutex);",
      "signal(mutex);"
    ],
    explanation: [
      "Lock read_count access.",
      "Increment readers.",
      "First reader locks writers out.",
      "Unlock read_count.",
      "Decrement readers.",
      "Last reader lets writers in."
    ]
  },
  RACE_CONDITION: {
    name: "Race Condition",
    description: "Demonstration of what happens when synchronization is disabled.",
    pseudocode: [
      "// No synchronization!",
      "enter_critical_section();",
      "modify_shared_data();",
      "exit_critical_section();"
    ],
    explanation: [
      "Processes enter CS without checking.",
      "Data inconsistency occurs.",
      "Multiple processes in CS simultaneously."
    ]
  },
  DEADLOCK: {
    name: "Deadlock Simulation",
    description: "A situation where processes are stuck waiting for each other.",
    pseudocode: [
      "P1: wait(R1); wait(R2);",
      "P2: wait(R2); wait(R1);"
    ],
    explanation: [
      "P1 holds R1, waits for R2.",
      "P2 holds R2, waits for R1.",
      "Circular dependency creates a deadlock."
    ]
  }
};
