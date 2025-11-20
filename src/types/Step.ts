export interface StepData {
  name: string;
  status: 'pending' | 'running' | 'success' | 'failed';
  progress?: { current: number; total: number };
  error?: Error;
}
