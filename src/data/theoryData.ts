import { 
  ShieldAlert, 
  Lock as LockIcon, 
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
  Wallet,
  Shield
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
    id: 'intro-definition',
    title: 'What is Synchronization?',
    content: 'Process Synchronization is a mechanism that coordinates the execution of processes that share data. It ensures that multiple processes do not access the same shared resource simultaneously in a way that leads to data corruption.',
    icon: Activity,
    subsections: [
      {
        title: 'The Core Objective',
        content: 'To prevent data inconsistency and ensure that co-operating processes execute in a predictable, orderly fashion.',
        list: [
          '👉 Example: Two people editing the same Word document via cloud - sync ensures one person\'s "Save" doesn\'t erase the other\'s changes.'
        ]
      },
      {
        title: 'Cooperating Processes',
        content: 'Processes that can affect or be affected by other processes. They must coordinate to share data safely.',
        list: [
          '👉 Example: A producer process generating data and a consumer process using it must wait for each other.'
        ]
      }
    ]
  },
  {
    id: 'definition',
    title: 'Why Synchronization?',
    content: 'Modern Operating Systems run multiple processes concurrently. These processes share resources like memory, files, and printers. Without careful coordination, this shared access leads to absolute chaos.',
    icon: Lightbulb,
    subsections: [
      {
        title: 'Concurrent Execution',
        content: 'The CPU rapidly switches between processes, creating the appearance of parallel execution.',
        list: [
          '👉 Example: Running a browser, a music player, and a code editor at once. The OS syncs resources like your sound card so only one plays audio properly.'
        ]
      }
    ]
  },
  {
    id: 'race-condition-detailed',
    title: 'Race Condition',
    content: 'A race condition occurs when multiple processes access shared data simultaneously, and the final outcome depends on the specific order of execution.',
    icon: AlertTriangle,
    subsections: [
      {
        title: 'The Interleaving Problem',
        content: 'Even a simple "counter++" can fail if interleaved. It compiles to three instructions: Load, Add, Store.',
        list: [
          'Example: Two ATMs withdrawing $50 from a $60 account.',
          'P1 checks: $60 available.',
          'P2 checks: $60 available.',
          'P1 withdraws: balance becomes $10.',
          'P2 withdraws: balance becomes $10 (but total $100 was taken!).'
        ]
      }
    ]
  },
  {
    id: 'critical-section-problem',
    title: 'Critical Section Problem',
    content: 'The Critical Section (CS) is the segment of code where a process accesses shared resources.',
    icon: LockIcon,
    subsections: [
      {
        title: 'Process Structure',
        content: 'A robust solution must manage these phases:',
        list: [
          'Entry Section: Requesting a key.',
          'Critical Section: Being inside the room.',
          'Exit Section: Returning the key.',
          '👉 Example: A shared printer - the code sending data to the printer is the Critical Section.'
        ]
      }
    ]
  },
  {
    id: 'hardware-sync',
    title: 'Hardware Synchronization',
    content: 'Modern hardware provides atomic instructions that cannot be interrupted, ensuring atomic lock acquisition.',
    icon: Cpu,
    subsections: [
      {
        title: 'TestAndSet & CAS',
        content: 'Atomic instructions that read and write memory in a single clock cycle.',
        list: [
          '👉 Example: A "Stop/Go" sign that changes color instantly. You cannot see it half-red and half-green.'
        ]
      }
    ]
  },
  {
    id: 'monitors-theory',
    title: 'Monitors',
    content: 'A high-level language construct that provides automatic mutual exclusion.',
    icon: Shield,
    subsections: [
      {
        title: 'Condition Variables',
        content: 'Uses wait() and signal() to manage process queues.',
        list: [
          '👉 Example: A bank vault with an automated security guard. You say "I want to deposit", the guard handles the door and locks for you.'
        ]
      }
    ]
  }
];

export const SYNCHRONIZATION_THEORY: TheoryConcept[] = [
  {
    id: 'mutex-lock',
    title: 'Mutex Lock',
    description: 'A binary synchronization primitive (binary semaphore) that ensures mutual exclusion.',
    icon: LockIcon,
    points: [
      'Example: Restroom binary key.',
      'acquire() -> take the key',
      'release() -> return the key',
      'One process at a time.'
    ]
  },
  {
    id: 'peterson-algo',
    title: "Peterson's Algorithm",
    description: 'A classic software solution for 2 processes using flag[2] and turn variables.',
    icon: RotateCcw,
    points: [
      'Example: Two polite people at a door.',
      'flag[i] = true (I want to go)',
      'turn = j (You go first)',
      'Safe from collision.'
    ]
  },
  {
    id: 'semaphores',
    title: 'Semaphores',
    description: 'Integer variables accessed only via wait(P) and signal(V).',
    icon: Workflow,
    points: [
      'Example: Parking lot with 10 slots.',
      'S=10 (Available slots)',
      'wait(S) fills a slot (S--)',
      'signal(S) frees a slot (S++)'
    ]
  },
  {
    id: 'monitors-comp',
    title: 'Monitors',
    description: 'High-level synchronization construct with automatic mutual exclusion.',
    icon: Shield,
    points: [
      'Example: Java synchronized blocks.',
      'Automatic locking/unlocking',
      'Compiler-managed safety',
      'No manual lock errors'
    ]
  }
];
