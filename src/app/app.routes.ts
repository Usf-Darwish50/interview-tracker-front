import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CandidatesComponent } from './Candidate/candidates/candidates.component';
import { ProcessesComponent } from './processes/processes.component';
import { CreateCandidateComponent } from './Candidate/create-candidate/create-candidate.component';
import { CandidateProfileComponent } from './Candidate/candidate-profile/candidate-profile.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'candidates', component: CandidatesComponent },
  { path: 'processes', component: ProcessesComponent },
  { path: 'add-candidate', component: CreateCandidateComponent },
  { path: 'candidate-profile/:id', component: CandidateProfileComponent },
];
