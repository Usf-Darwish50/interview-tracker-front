// Define the stage status enum, mirroring your backend
export enum StageStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

// Define the Stage interface
export interface Stage {
  stageId: number;
  title: string;
  description: string;
  stageOrder: number;
  status: StageStatus;
  hiringProcess: any; // Or define a HiringProcess interface
  assignedInterviewers: any[]; // Or define an Interviewer interface
  deleted: boolean;
  icon?: string;
}
