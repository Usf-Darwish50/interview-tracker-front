import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  processDistribution = {
    completed: 45,
    inProgress: 35,
    cancelled: 20,
  };

  activeProcesses = [
    {
      id: 1,
      title: 'Software Engineer Hiring',
      candidateCount: 5,
      status: 'In Progress',
      statusClass: 'in-progress',
    },
    {
      id: 2,
      title: 'Data Scientist Recruitment',
      candidateCount: 3,
      status: 'Completed',
      statusClass: 'completed',
    },
    {
      id: 3,
      title: 'UX Designer Hiring',
      candidateCount: 4,
      status: 'In Progress',
      statusClass: 'in-progress',
    },
    {
      id: 4,
      title: 'DevOps Specialist Hiring',
      candidateCount: 2,
      status: 'Cancelled',
      statusClass: 'cancelled',
    },
  ];
}
