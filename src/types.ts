export type ProcessState = 'NEW' | 'READY' | 'RUNNING' | 'WAITING' | 'TERMINATED';

export type AlgorithmType = 
  | 'PETERSON' 
  | 'MUTEX' 
  | 'BINARY_SEMAPHORE' 
  | 'COUNTING_SEMAPHORE' 
  | 'PRODUCER_CONSUMER' 
  | 'DINING_PHILOSOPHERS' 
  | 'READERS_WRITERS'
  | 'RACE_CONDITION'
  | 'DEADLOCK';

export interface Process {
  id: number;
  state: ProcessState;
  progress: number; // 0 to 100
  color: string;
  label: string;
  waitingTime: number;
}

export interface SimulationState {
  processes: Process[];
  criticalSection: number[]; // IDs of processes in CS
  waitingQueue: number[]; // IDs of processes waiting
  variables: Record<string, any>;
  isRunning: boolean;
  speed: number;
  currentStep: number;
  algorithm: AlgorithmType;
  logs: string[];
  history: {
    time: number;
    csSize: number;
    queueSize: number;
    cpuUtil: number;
  }[];
}
