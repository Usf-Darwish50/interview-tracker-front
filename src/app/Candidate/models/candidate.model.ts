export interface newCandidate {
  fullName: string;
  phone: string;
  address: string;
  email: string;
  position: string;
  resumeUrl: string;
}

export interface Candidate {
  candidateId: number;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  position: string;
  cvUrl: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  currentStageId: number;
  deleted: boolean;
}
