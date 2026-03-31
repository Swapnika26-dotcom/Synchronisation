import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Process, SimulationState, AlgorithmType, ProcessState } from './types';

const INITIAL_PROCESS_COUNT = 3;

export function useSimulation() {
  const [state, setState] = useState<SimulationState>({
    processes: [],
    criticalSection: [],
    waitingQueue: [],
    variables: {},
    isRunning: false,
    speed: 1,
    currentStep: 0,
    algorithm: 'MUTEX',
    logs: ['Simulation initialized.'],
    history: []
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const timeRef = useRef(0);

  const resetSimulation = useCallback((algo?: AlgorithmType, count?: number) => {
    const selectedAlgo = algo || state.algorithm;
    const processCount = count || (selectedAlgo === 'PETERSON' ? 2 : selectedAlgo === 'DINING_PHILOSOPHERS' ? 5 : INITIAL_PROCESS_COUNT);
    
    const newProcesses: Process[] = Array.from({ length: processCount }, (_, i) => ({
      id: i,
      state: 'READY',
      progress: 0,
      color: `hsl(${(i * 360) / processCount}, 70%, 50%)`,
      label: `P${i}`,
      waitingTime: 0
    }));

    let initialVars: Record<string, any> = {};
    if (selectedAlgo === 'PETERSON') {
      initialVars = { flag: [false, false], turn: 0 };
    } else if (selectedAlgo === 'MUTEX' || selectedAlgo === 'BINARY_SEMAPHORE') {
      initialVars = { locked: false, S: 1 };
    } else if (selectedAlgo === 'COUNTING_SEMAPHORE') {
      initialVars = { S: 3 };
    } else if (selectedAlgo === 'PRODUCER_CONSUMER') {
      initialVars = { buffer: [], mutex: 1, empty: 5, full: 0 };
    } else if (selectedAlgo === 'DINING_PHILOSOPHERS') {
      initialVars = { chopsticks: [1, 1, 1, 1, 1] };
    } else if (selectedAlgo === 'READERS_WRITERS') {
      initialVars = { read_count: 0, mutex: 1, rw_mutex: 1 };
    } else if (selectedAlgo === 'DEADLOCK') {
      initialVars = { R1: 1, R2: 1 };
    }

    setState(prev => ({
      ...prev,
      processes: newProcesses,
      criticalSection: [],
      waitingQueue: [],
      variables: initialVars,
      isRunning: false,
      currentStep: 0,
      algorithm: selectedAlgo,
      logs: [`Switched to ${selectedAlgo}. Simulation reset.`],
      history: []
    }));
    timeRef.current = 0;
  }, [state.algorithm]);

  useEffect(() => {
    resetSimulation();
  }, []);

  const step = useCallback(() => {
    setState(prev => {
      const nextProcesses = [...prev.processes];
      const nextCS = [...prev.criticalSection];
      const nextQueue = [...prev.waitingQueue];
      const nextVars = { ...prev.variables };
      const nextLogs = [...prev.logs];
      
      // Randomly pick a process that wants to do something
      const readyProcesses = nextProcesses.filter(p => p.state === 'READY' || p.state === 'WAITING');
      if (readyProcesses.length === 0 && nextCS.length === 0) {
        return { ...prev, isRunning: false, logs: [...nextLogs, "All processes finished."] };
      }

      // Logic based on algorithm
      const pIdx = Math.floor(Math.random() * nextProcesses.length);
      const p = nextProcesses[pIdx];

      if (p.state === 'READY') {
        // Process wants to enter CS
        if (prev.algorithm === 'RACE_CONDITION') {
          p.state = 'RUNNING';
          nextCS.push(p.id);
          nextLogs.push(`${p.label} entered Critical Section (No Sync).`);
        } else if (prev.algorithm === 'MUTEX') {
          if (!nextVars.locked) {
            nextVars.locked = true;
            p.state = 'RUNNING';
            nextCS.push(p.id);
            nextLogs.push(`${p.label} acquired Mutex and entered CS.`);
          } else {
            p.state = 'WAITING';
            nextQueue.push(p.id);
            nextLogs.push(`${p.label} blocked by Mutex.`);
          }
        } else if (prev.algorithm === 'PETERSON') {
          const i = p.id;
          const j = 1 - i;
          if (!nextVars.flag[i]) {
            nextVars.flag[i] = true;
            nextVars.turn = j;
            nextLogs.push(`${p.label} set flag[${i}]=true, turn=${j}`);
          }
          if (nextVars.flag[j] && nextVars.turn === j) {
            if (p.state !== 'WAITING') {
              p.state = 'WAITING';
              nextQueue.push(p.id);
            }
          } else {
            p.state = 'RUNNING';
            nextCS.push(p.id);
            const qIdx = nextQueue.indexOf(p.id);
            if (qIdx > -1) nextQueue.splice(qIdx, 1);
            nextLogs.push(`${p.label} entered CS (Peterson).`);
          }
        } else if (prev.algorithm === 'BINARY_SEMAPHORE' || prev.algorithm === 'COUNTING_SEMAPHORE') {
          if (nextVars.S > 0) {
            nextVars.S--;
            p.state = 'RUNNING';
            nextCS.push(p.id);
            nextLogs.push(`${p.label} decremented S to ${nextVars.S} and entered CS.`);
          } else {
            p.state = 'WAITING';
            nextQueue.push(p.id);
            nextLogs.push(`${p.label} waiting on Semaphore (S=0).`);
          }
        } else if (prev.algorithm === 'PRODUCER_CONSUMER') {
          const isProducer = p.id % 2 === 0;
          if (isProducer) {
            if (nextVars.empty > 0 && nextVars.mutex > 0) {
              nextVars.empty--;
              nextVars.mutex--;
              nextVars.buffer.push('item');
              p.state = 'RUNNING';
              nextCS.push(p.id);
              nextLogs.push(`${p.label} (Producer) added item. Buffer: ${nextVars.buffer.length}`);
            } else {
              p.state = 'WAITING';
              nextQueue.push(p.id);
            }
          } else {
            if (nextVars.full > 0 && nextVars.mutex > 0) {
              nextVars.full--;
              nextVars.mutex--;
              nextVars.buffer.pop();
              p.state = 'RUNNING';
              nextCS.push(p.id);
              nextLogs.push(`${p.label} (Consumer) removed item. Buffer: ${nextVars.buffer.length}`);
            } else {
              p.state = 'WAITING';
              nextQueue.push(p.id);
            }
          }
        } else if (prev.algorithm === 'DINING_PHILOSOPHERS') {
          const left = p.id;
          const right = (p.id + 1) % nextProcesses.length;
          if (nextVars.chopsticks[left] === 1 && nextVars.chopsticks[right] === 1) {
            nextVars.chopsticks[left] = 0;
            nextVars.chopsticks[right] = 0;
            p.state = 'RUNNING';
            nextCS.push(p.id);
            nextLogs.push(`${p.label} picked up chopsticks ${left} & ${right} and is eating.`);
          } else {
            p.state = 'WAITING';
            nextQueue.push(p.id);
            nextLogs.push(`${p.label} waiting for chopsticks.`);
          }
        } else if (prev.algorithm === 'READERS_WRITERS') {
          const isWriter = p.id === 0;
          if (isWriter) {
            if (nextVars.rw_mutex === 1) {
              nextVars.rw_mutex = 0;
              p.state = 'RUNNING';
              nextCS.push(p.id);
              nextLogs.push(`${p.label} (Writer) started writing.`);
            } else {
              p.state = 'WAITING';
              nextQueue.push(p.id);
            }
          } else {
            if (nextVars.rw_mutex === 1 || nextCS.some(id => id !== 0)) {
              if (nextVars.read_count === 0) nextVars.rw_mutex = 0;
              nextVars.read_count++;
              p.state = 'RUNNING';
              nextCS.push(p.id);
              nextLogs.push(`${p.label} (Reader) started reading. Total: ${nextVars.read_count}`);
            } else {
              p.state = 'WAITING';
              nextQueue.push(p.id);
            }
          }
        } else if (prev.algorithm === 'DEADLOCK') {
           // P0 wants R1 then R2, P1 wants R2 then R1
           if (p.id === 0) {
             if (nextVars.R1 > 0) {
               nextVars.R1--;
               nextLogs.push(`P0 acquired R1.`);
               // Now wants R2
               if (nextVars.R2 > 0) {
                 nextVars.R2--;
                 p.state = 'RUNNING';
                 nextCS.push(p.id);
                 nextLogs.push(`P0 acquired R2 and entered CS.`);
               } else {
                 p.state = 'WAITING';
                 nextQueue.push(p.id);
                 nextLogs.push(`P0 waiting for R2 (Deadlock Risk).`);
               }
             }
           } else if (p.id === 1) {
             if (nextVars.R2 > 0) {
               nextVars.R2--;
               nextLogs.push(`P1 acquired R2.`);
               if (nextVars.R1 > 0) {
                 nextVars.R1--;
                 p.state = 'RUNNING';
                 nextCS.push(p.id);
                 nextLogs.push(`P1 acquired R1 and entered CS.`);
               } else {
                 p.state = 'WAITING';
                 nextQueue.push(p.id);
                 nextLogs.push(`P1 waiting for R1 (Deadlock Risk).`);
               }
             }
           }
        }
      } else if (p.state === 'RUNNING') {
        p.progress += 20 * prev.speed;
        if (p.progress >= 100) {
          p.state = 'TERMINATED';
          p.progress = 100;
          const csIdx = nextCS.indexOf(p.id);
          if (csIdx > -1) nextCS.splice(csIdx, 1);
          
          // Release resources
          if (prev.algorithm === 'MUTEX') {
            nextVars.locked = false;
            nextLogs.push(`${p.label} released Mutex.`);
          } else if (prev.algorithm === 'PETERSON') {
            nextVars.flag[p.id] = false;
            nextLogs.push(`${p.label} set flag[${p.id}]=false.`);
          } else if (prev.algorithm === 'BINARY_SEMAPHORE' || prev.algorithm === 'COUNTING_SEMAPHORE') {
            nextVars.S++;
            nextLogs.push(`${p.label} incremented S to ${nextVars.S}.`);
          } else if (prev.algorithm === 'PRODUCER_CONSUMER') {
            nextVars.mutex++;
            if (p.id % 2 === 0) nextVars.full++;
            else nextVars.empty++;
          } else if (prev.algorithm === 'DINING_PHILOSOPHERS') {
            const left = p.id;
            const right = (p.id + 1) % nextProcesses.length;
            nextVars.chopsticks[left] = 1;
            nextVars.chopsticks[right] = 1;
            nextLogs.push(`${p.label} finished eating and released chopsticks.`);
          } else if (prev.algorithm === 'READERS_WRITERS') {
            if (p.id === 0) {
              nextVars.rw_mutex = 1;
              nextLogs.push(`${p.label} (Writer) finished.`);
            } else {
              nextVars.read_count--;
              if (nextVars.read_count === 0) nextVars.rw_mutex = 1;
              nextLogs.push(`${p.label} (Reader) finished.`);
            }
          } else if (prev.algorithm === 'DEADLOCK') {
            if (p.id === 0) { nextVars.R1++; nextVars.R2++; }
            else { nextVars.R2++; nextVars.R1++; }
          }

          // Check waiting queue
          if (nextQueue.length > 0) {
            // Simple wake up first in queue
            const nextToWakeId = nextQueue[0];
            const nextToWake = nextProcesses.find(proc => proc.id === nextToWakeId);
            if (nextToWake) {
              nextToWake.state = 'READY';
              // nextQueue.splice(0, 1); // Don't remove yet, let the next step handle entry
            }
          }
          
          // Reset for next cycle if not truly terminated (simulation loop)
          setTimeout(() => {
            setState(s => {
              const ps = [...s.processes];
              const target = ps.find(proc => proc.id === p.id);
              if (target) {
                target.state = 'READY';
                target.progress = 0;
              }
              return { ...s, processes: ps };
            });
          }, 1000 / prev.speed);
        }
      } else if (p.state === 'WAITING') {
        p.waitingTime += 1;
        // Check if can wake up
        if (prev.algorithm === 'MUTEX' && !nextVars.locked) {
           p.state = 'READY';
           const qIdx = nextQueue.indexOf(p.id);
           if (qIdx > -1) nextQueue.splice(qIdx, 1);
        } else if (prev.algorithm === 'BINARY_SEMAPHORE' || prev.algorithm === 'COUNTING_SEMAPHORE') {
          if (nextVars.S > 0) {
            p.state = 'READY';
            const qIdx = nextQueue.indexOf(p.id);
            if (qIdx > -1) nextQueue.splice(qIdx, 1);
          }
        } else if (prev.algorithm === 'PETERSON') {
          const i = p.id;
          const j = 1 - i;
          if (!(nextVars.flag[j] && nextVars.turn === j)) {
            p.state = 'READY';
            const qIdx = nextQueue.indexOf(p.id);
            if (qIdx > -1) nextQueue.splice(qIdx, 1);
          }
        }
      }

      // Update history for graphs
      const newHistory = [...prev.history, {
        time: timeRef.current++,
        csSize: nextCS.length,
        queueSize: nextQueue.length,
        cpuUtil: nextProcesses.filter(proc => proc.state === 'RUNNING').length / nextProcesses.length * 100
      }].slice(-20);

      return {
        ...prev,
        processes: nextProcesses,
        criticalSection: nextCS,
        waitingQueue: nextQueue,
        variables: nextVars,
        logs: nextLogs.slice(-10),
        history: newHistory,
        currentStep: prev.currentStep + 1
      };
    });
  }, [state.speed]);

  useEffect(() => {
    if (state.isRunning) {
      timerRef.current = setInterval(step, 1000 / state.speed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [state.isRunning, state.speed, step]);

  return {
    state,
    setState,
    resetSimulation,
    step
  };
}
