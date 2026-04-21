import { 
  ShieldAlert, 
  Lock, 
  RotateCcw, 
  Hourglass, 
  Ban, 
  Trophy, 
  Layers, 
  Workflow,
  MousePointer2,
  AlertTriangle,
  Lightbulb,
  Cpu,
  Unplug,
  Users,
  Activity,
  Terminal,
  Printer,
  Wallet
} from 'lucide-react';

export interface TheoryConcept {
  id: string;
  title: string;
  description: string;
  icon: any;
  points: string[];
}

export interface FundamentalData {
  id: string;
  title: string;
  content: string;
  icon: any;
  subsections?: { title: string; content: string; list?: string[] }[];
}

export const SYNCHRONIZATION_FUNDAMENTALS: FundamentalData[] = [
  {
    id: 'definition',
    title: 'Definition of Synchronization',
    content: 'Synchronization is the process of coordinating the execution of multiple processes or threads to ensure that shared resources are accessed in a controlled and predictable manner.',
    icon: Activity,
    subsections: [
      {
        title: 'In simple terms',
        content: '👉 It makes sure that only one process uses a shared resource at a time when required, preventing conflicts.'
      }
    ]
  },
  {
    id: 'need',
    title: 'Why Synchronization is Needed',
    content: 'In modern systems, multiple processes run concurrently and often share memory, files, variables, and devices (printer, disk, etc.).',
    icon: Cpu,
    subsections: [
      {
        title: 'Potential Problems',
        content: 'If multiple processes try to access or modify the same data at the same time, it leads to problems such as:',
        list: [
          'Race Condition: Output depends on sequence or timing.',
          'Data Inconsistency: Corrupted or partially updated data.',
          'System Crashes: Deadlocks or starvation.'
        ]
      }
    ]
  },
  {
    id: 'race-condition-detailed',
    title: 'Race Condition',
    content: 'A race condition occurs when the output depends on the sequence or timing of process execution.',
    icon: AlertTriangle,
    subsections: [
      {
        title: 'The Counter Problem Example',
        content: 'Suppose two processes increment a shared variable x = 5.',
        list: [
          'Process A reads x → 5',
          'Process B reads x → 5',
          'A increments → 6',
          'B increments → 6',
          '👉 Final value = 6 (wrong). Correct value should be = 7.'
        ]
      }
    ]
  },
  {
    id: 'critical-section-problem',
    title: 'Critical Section Problem',
    content: 'A critical section is a part of the program where shared resources are accessed.',
    icon: Lock,
    subsections: [
      {
        title: 'Structure of a Process',
        content: 'Processes typically follow this flow:',
        list: [
          'Entry Section – Request permission',
          'Critical Section – Access shared resource',
          'Exit Section – Release permission',
          'Remainder Section – Other code'
        ]
      },
      {
        title: 'Goal',
        content: 'Ensure that only one process is inside the critical section at any time.'
      }
    ]
  },
  {
    id: 'requirements',
    title: 'Requirements for Synchronization',
    content: 'To solve synchronization issues, a correct solution must satisfy three core conditions:',
    icon: Trophy,
    subsections: [
      {
        title: 'Core Conditions',
        content: '',
        list: [
          'Mutual Exclusion: Only one process inside at a time.',
          'Progress: If none are inside, decision to enter must not wait indefinitely.',
          'Bounded Waiting: A process should not wait forever (no starvation).'
        ]
      }
    ]
  },
  {
    id: 'real-life',
    title: 'Real-Life Examples',
    content: 'Process synchronization isn\'t just code—it happens all around us.',
    icon: Users,
    subsections: [
      {
        title: 'Printer Usage',
        content: 'Many users send print requests, but only one printer is available. Synchronization ensures one job prints at a time while others wait in a queue.',
        list: []
      },
      {
        title: 'Bank Account',
        content: 'If you withdraw ₹100 and deposit ₹200 simultaneously, synchronization ensures the balance updates correctly by processing them sequentially.',
        list: []
      }
    ]
  }
];

export const SYNCHRONIZATION_THEORY: TheoryConcept[] = [
  {
    id: 'race-condition',
    title: 'Race Condition',
    description: 'A situation where the outcome of a process depends on the specific order or timing of other uncontrollable events. It happens when multiple threads access shared data concurrently.',
    icon: ShieldAlert,
    points: [
      'Occurs in shared memory systems',
      'Leads to inconsistent data states',
      'Prevented using mutual exclusion'
    ]
  },
  {
    id: 'critical-section',
    title: 'Critical Section',
    description: 'A segment of code where a process accesses common variables, updates tables, or writes files. Only one process should execute in its critical section at any time.',
    icon: Lock,
    points: [
      'Mutual Exclusion: Only one process inside',
      'Progress: Decision to enter cannot be delayed indefinitely',
      'Bounded Waiting: Limit on number of times others enter before a waiting process'
    ]
  },
  {
    id: 'deadlock',
    title: 'Deadlock',
    description: 'A state where a set of processes are blocked because each process is holding a resource and waiting for another resource acquired by some other process.',
    icon: Ban,
    points: [
      'Mutual Exclusion',
      'Hold and Wait',
      'No Preemption',
      'Circular Wait'
    ]
  },
  {
    id: 'starvation',
    title: 'Starvation',
    description: 'A problem where a process is perpetually denied necessary resources to process its work. It often occurs in priority-based scheduling algorithms.',
    icon: Hourglass,
    points: [
      'Lower priority processes never execute',
      'Solved using "Aging" technique',
      'Resource management failure'
    ]
  },
  {
    id: 'monitors',
    title: 'Monitors',
    description: 'A high-level synchronization construct that provides a convenient and effective mechanism for process synchronization. It encapsulates shared variables and procedures.',
    icon: Layers,
    points: [
      'Implicit mutual exclusion',
      'Condition variables for signaling',
      'Simplified concurrency control'
    ]
  },
  {
    id: 'peterson-solution',
    title: 'Peterson\'s Solution',
    description: 'A classic software-based solution to the critical section problem for two processes. It uses shared flags and a turn variable.',
    icon: RotateCcw,
    points: [
      'Software-only solution',
      'Guarantees all three requirements',
      'Limited to two processes'
    ]
  },
  {
    id: 'bounded-waiting',
    title: 'Bounded Waiting',
    description: 'The requirement that there exists a bound on the number of times that other processes are allowed to enter their critical sections after a process has made a request.',
    icon: Trophy,
    points: [
      'Prevents starvation',
      'Ensures fairness',
      'Critical for real-time systems'
    ]
  },
  {
    id: 'inter-process',
    title: 'Inter-Process Communication',
    description: 'Mechanisms that allow processes to communicate and synchronize their actions, typically via shared memory or message passing.',
    icon: Workflow,
    points: [
      'Shared Memory (fast)',
      'Message Passing (robust)',
      'Semaphores as coordination agents'
    ]
  }
];
