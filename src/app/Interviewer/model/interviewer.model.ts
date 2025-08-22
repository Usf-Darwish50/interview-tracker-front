export interface Interviewer {
  interviewerId: number;
  username: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  deleted: boolean;
}
