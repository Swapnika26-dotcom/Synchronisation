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
    title: 'Mechanism of Synchronization',
    content: 'Process Synchronization is the multi-process coordination of atomic operation sequences that access shared data. It prevents race conditions—states where the final computational outcome depends on the non-deterministic interleaving of process execution.',
    icon: Activity,
    subsections: [
      {
        title: 'Safety and Liveness',
        content: 'Robust synchronization must satisfy Safety (mutual exclusion), Liveness (progress), and Boundedness (no starvation).',
        list: [
          '👉 Safety: No two processes are in the critical section simultaneously.',
          '👉 Liveness: If no process is in the critical section, no process is blocked from entering.',
          '👉 Bounded Waiting: A limit exists on the number of times other processes can enter the CS before a requesting process is granted entry.'
        ]
      }
    ]
  },
  {
    id: 'race-condition-detailed',
    title: 'The Race Condition',
    content: 'A software anomaly occurring when the timing or interleaving of multiple execution threads impacts the correctness of shared state. It typically arises from non-atomic Read-Modify-Write cycles.',
    icon: AlertTriangle,
    subsections: [
      {
        title: 'The CS Problem',
        content: 'The Critical Section (CS) is the portion of code where shared memory is modified. Protecting this section is the primary goal of concurrency control.',
        list: [
          'Example: Two threads incrementing a shared counter simultaneously without locks often results in lost updates because the increment operation is not atomic at the machine level.'
        ]
      }
    ]
  },
  {
    id: 'critical-section-problem',
    title: 'Solution Design',
    content: 'A software or hardware solution to the synchronization problem must ensure that code execution follows a strict Entry → Critical → Exit sequence.',
    icon: LockIcon,
    subsections: [
      {
        title: 'Protocol Phases',
        content: 'All synchronization solutions rely on a standardized request/release protocol.',
        list: [
          'Entry Section: Atomically requests permission to enter.',
          'Critical Section: Executes the non-stoppable shared data modification.',
          'Exit Section: Releases the lock and signals waiting processes.'
        ]
      }
    ]
  }
];

export const SYNCHRONIZATION_THEORY: TheoryConcept[] = [
  {
    id: 'mutex-lock',
    title: 'Mutex Lock',
    description: 'A hardware-supported software primitive (binary semaphore) used to provide exclusive access to a resource.',
    icon: LockIcon,
    points: [
      'Strict Ownership Requirement',
      'Binary States: Locked / Unlocked',
      'Prevents simultaneous context entry',
      'Atomic Acquire/Release operations'
    ]
  },
  {
    id: 'peterson-algo',
    title: "Peterson's Algorithm",
    description: 'A classic software-based solution for two processes using shared flag and turn variables.',
    icon: RotateCcw,
    points: [
      'Provably correct for 2 processes',
      'No specialized hardware needed',
      'Progressive and fair scheduling',
      'Uses shared memory flags'
    ]
  },
  {
    id: 'semaphores',
    title: 'Semaphores',
    description: 'Integer-based signaling mechanisms used to coordinate multiple processes via atomic P (Wait) and V (Signal) operations.',
    icon: Workflow,
    points: [
      'Counting semaphores for resource pools',
      'Binary semaphores for mutual exclusion',
      'Avoids busy-waiting via queueing',
      'Dijkstra\'s fundamental primitive'
    ]
  },
  {
    id: 'monitors-comp',
    title: 'Monitors',
    description: 'High-level programmatic constructs providing automatic mutual exclusion via compiler-enforced locking.',
    icon: Shield,
    points: [
      'Object-oriented abstraction',
      'Encapsulates data and procedures',
      'Built-in condition variables',
      'Eliminates manual lock errors'
    ]
  }
];
