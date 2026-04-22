import { ConceptData } from "./types";

export const ALGORITHMS: ConceptData[] = [
  // SOFTWARE ALGORITHMS
  {
    id: 'peterson',
    category: 'software',
    title: "Peterson's Algorithm",
    subtitle: 'Classic Software Sync',
    description: "A software solution for 2 processes using a combination of flag and turn variables.",
    properties: [
      { label: 'PROCESSES', value: 'Exactly 2' },
      { label: 'VARS', value: 'flag[2], turn' },
      { label: 'MECHANISM', value: 'Flag + Turn' }
    ],
    pseudocode: `// Process i
flag[i] = true;
turn = j;
while(flag[j] && turn == j);

// critical section

flag[i] = false;`
  },
  {
    id: 'dekker',
    category: 'software',
    title: "Dekker's Algorithm",
    subtitle: 'First Correct Software Solution',
    description: "The first documented correct software-only solution to the mutual exclusion problem.",
    properties: [
      { label: 'HISTORY', value: 'First Known' },
      { label: 'VARS', value: 'want[2], turn' },
      { label: 'TYPE', value: 'Busy Waiting' }
    ],
    pseudocode: `flag[i] = true;
while(flag[j]) {
  if (turn == j) {
    flag[i] = false;
    while(turn == j);
    flag[i] = true;
  }
}
// CS... turn = j; flag[i] = false;`
  },
  {
    id: 'bakery',
    category: 'software',
    title: "Bakery Algorithm",
    subtitle: 'N-Process Fairness',
    description: "Lamport's Bakery algorithm handles N processes by assigning a ticket number to each requesting process.",
    properties: [
      { label: 'N-PROCESS', value: 'Supported' },
      { label: 'LOGIC', value: 'Ticket Queue' },
      { label: 'FAIR', value: 'First-Come' }
    ],
    pseudocode: `choosing[i] = true;
number[i] = max(number[0..n-1]) + 1;
choosing[i] = false;
for (j = 0; j < n; j++) {
  while (choosing[j]);
  while (number[j] != 0 && (number[j],j) < (number[i],i));
}
// CS... number[i] = 0;`
  },

  // MECHANISMS
  {
    id: 'mutex',
    category: 'mechanism',
    title: 'Mutex Lock',
    subtitle: 'Binary Resource Key',
    description: 'A tool that provides mutual exclusion by allowing only one owner to access the resource.',
    properties: [
      { label: 'TYPE', value: 'Binary' },
      { label: 'MODE', value: 'Locked/Unlocked' },
      { label: 'COST', value: 'Minimal' }
    ],
    pseudocode: `acquire(lock) {
   while (lock == busy);
   lock = busy;
}
release(lock) {
   lock = free;
}`
  },
  {
    id: 'semaphore',
    category: 'mechanism',
    title: 'Semaphores',
    subtitle: 'Integer Coordination Variable',
    description: 'Kernel variables (binary or counting) that manage access to shared resource pools.',
    properties: [
      { label: 'TYPES', value: 'Binary/Counting' },
      { label: 'PRIMITIVES', value: 'wait/signal' },
      { label: 'USE', value: 'Resource Pool' }
    ],
    pseudocode: `wait(S) {
  while (S <= 0);
  S--;
}
signal(S) {
  S++;
}`
  },
  {
    id: 'monitor',
    category: 'mechanism',
    title: 'Monitors',
    subtitle: 'Object-Oriented Sync',
    description: 'A high-level abstraction that provides automatic mutual exclusion for shared data objects.',
    properties: [
      { label: 'ABSTRACTION', value: 'High Level' },
      { label: 'SUPPORT', value: 'Modern Languages' },
      { label: 'SAFETY', value: 'Automatic' }
    ],
    pseudocode: `monitor SynchronizedObject {
  public synchronized void operation() {
    // only one process active here
  }
}`
  },
  {
    id: 'condition',
    category: 'mechanism',
    title: 'Condition Variables',
    subtitle: 'Event-Based Coordination',
    description: 'Allows processes to wait for specific conditions without holding onto busy-waiting loop cycles.',
    properties: [
      { label: 'COMMANDS', value: 'wait, signal' },
      { label: 'NATURE', value: 'Stateless' },
      { label: 'REQUIREMENT', value: 'Mutex' }
    ],
    pseudocode: `lock(mutex);
while (!condition) cond.wait(mutex);
// do work
cond.signal();
unlock(mutex);`
  },

  // PROBLEMS
  {
    id: 'prodcons',
    category: 'problem',
    title: 'Producer-Consumer',
    subtitle: 'Bounded Buffer Sync',
    description: 'Coordinating processes where producers add items and consumers remove them from a shared buffer.',
    properties: [
      { label: 'BUFFER', value: 'Fixed Size' },
      { label: 'VARS', value: 'full, empty, mutex' },
      { label: 'TYPE', value: 'Cooperation' }
    ],
    pseudocode: `Producer:
  wait(empty); wait(mutex);
  buffer.add();
  signal(mutex); signal(full);

Consumer:
  wait(full); wait(mutex);
  buffer.remove();
  signal(mutex); signal(empty);`
  },
  {
    id: 'dining',
    category: 'problem',
    title: 'Dining Philosophers',
    subtitle: 'Resource Conflicts',
    description: 'Five philosophers needing two shared chopsticks to eat. A classic model for deadlock analysis.',
    properties: [
      { label: 'RESOURCE', value: 'Shared Forks' },
      { label: 'PROBLEM', value: 'Deadlock' },
      { label: 'STATE', value: 'Thinking/Eating' }
    ],
    pseudocode: `while(true) {
  wait(chopstick[i]);
  wait(chopstick[(i+1)%5]);
  // eat...
  signal(chopstick[i]);
  signal(chopstick[(i+1)%5]);
}`
  },
  {
    id: 'rw',
    category: 'problem',
    title: 'Readers-Writers',
    subtitle: 'Shared Database Access',
    description: 'Managing access to a shared resource where readers can be concurrent but writers are exclusive.',
    properties: [
      { label: 'READERS', value: 'Multiple allowed' },
      { label: 'WRITERS', value: 'Strictly One' },
      { label: 'VAR', value: 'readcount' }
    ],
    pseudocode: `Reader:
  wait(mutex); readcount++;
  if (readcount==1) wait(wrt);
  signal(mutex); // READ...
  wait(mutex); readcount--;
  if (readcount==0) signal(wrt);
  signal(mutex);`
  },

  // HARDWARE
  {
    id: 'tas',
    category: 'hardware',
    title: 'Test-and-Set',
    subtitle: 'Atomic Bit Modification',
    description: 'A hardware-level instruction bit check and set operation for spinlock implementation.',
    properties: [
      { label: 'CPU', value: 'x86, ARM' },
      { label: 'MODE', value: 'Atomic' },
      { label: 'VALUE', value: 'Binary' }
    ],
    pseudocode: `boolean TestAndSet(boolean *lock) {
   boolean old = *lock;
   *lock = true;
   return old;
}`
  },
  {
    id: 'cas',
    category: 'hardware',
    title: 'Compare-and-Swap',
    subtitle: 'Conditional Atomic Write',
    description: 'Compares value and updates only if match. Foundation for lock-free data structures.',
    properties: [
      { label: 'TYPE', value: 'Non-blocking' },
      { label: 'HW', value: 'Atomic-Exchange' },
      { label: 'VARS', value: 'target, exp, new' }
    ],
    pseudocode: `int CAS(int *val, int exp, int next) {
  int old = *val;
  if (*val == exp) *val = next;
  return old;
}`
  },
  {
    id: 'swap',
    category: 'hardware',
    title: 'Swap Instruction',
    subtitle: 'Atomic Value Exchange',
    description: 'Atomically exchanges two memory locations to manage lock states safely.',
    properties: [
      { label: 'ISA', value: 'XCHG' },
      { label: 'OP', value: 'Atomic Swap' },
      { label: 'USAGE', value: 'Spinlock' }
    ],
    pseudocode: `void Swap(boolean *a, boolean *b) {
   boolean temp = *a;
   *a = *b;
   *b = temp;
}`
  },
  {
    id: 'faa',
    category: 'hardware',
    title: 'Fetch-and-Add',
    subtitle: 'Atomic Increment',
    description: 'Increments and returns the previous value in one atomic hardware cycle.',
    properties: [
      { label: 'OP', value: 'Atomic Inc' },
      { label: 'NATURE', value: 'Cumulative' },
      { label: 'USE', value: 'Ticket Locks' }
    ],
    pseudocode: `int FetchAndAdd(int *target, int inc) {
  int old = *target;
  *target += inc;
  return old;
}`
  },
  {
    id: 'llsc',
    category: 'hardware',
    title: 'LL / SC',
    subtitle: 'Load-Link / Store-Conditional',
    description: 'RISC atomic primitives that monitor bus collisions to ensure exclusive writes.',
    properties: [
      { label: 'ARCH', value: 'RISC Primitives' },
      { label: 'MONITOR', value: 'SC Logic' },
      { label: 'FLOW', value: 'Retry Loop' }
    ],
    pseudocode: `retry:
  LL r1, mem
  SC r2, r1, mem
  if(r2 == 0) goto retry`
  },
];

export const COLORS = [
  '#FBC3C1', // primary pink/peach
  '#3b82f6', // blue
  '#ec4899', // pink
  '#10b981', // emerald
  '#f59e0b', // amber
  '#8b5cf6', // violet
  '#f97316', // orange
  '#ef4444', // red
];
