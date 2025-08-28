import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CandidatesComponent } from './Candidate/candidates/candidates.component';
import { ProcessesComponent } from './Process/processes/processes.component';
import { CreateCandidateComponent } from './Candidate/create-candidate/create-candidate.component';
import { CandidateProfileComponent } from './Candidate/candidate-profile/candidate-profile.component';
import { ProcessProfileComponent } from './Process/process-profile/process-profile.component';
import { InterviewersListComponent } from './Interviewer/interviewers-list/interviewers-list.component';
import { AddInterviewerComponent } from './Interviewer/add-interviewer/add-interviewer.component';
import { LoginComponent } from './Auth/login/login.component';
import { SignupComponent } from './Auth/signup/signup.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'candidates', component: CandidatesComponent },
  { path: 'processes', component: ProcessesComponent },
  { path: 'add-candidate', component: CreateCandidateComponent },
  { path: 'candidate-profile/:id', component: CandidateProfileComponent },
  { path: 'process-profile/:id', component: ProcessProfileComponent },
  { path: 'interviewers', component: InterviewersListComponent },
  { path: 'add-interviewer', component: AddInterviewerComponent },
];
