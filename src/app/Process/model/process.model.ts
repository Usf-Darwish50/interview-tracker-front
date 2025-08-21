export interface HiringProcessProfile {
  processId: number;
  title: string;
  status: ProcessStatus;
  createdDate: string;
  createdBy: string;
}

export enum ProcessStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}
