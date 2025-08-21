import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AddProcessComponent } from '../Process/add-process/add-process.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, AddProcessComponent],
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

  showAddProcessDialog = false;
  //Default manager id for now
  managerId = 3;

  onAddProcessClick() {
    this.showAddProcessDialog = true;
  }

  onProcessCreated() {
    // Logic to refresh the process list, if needed.
    console.log('Process created. Refreshing dashboard data...');
    // You might want to call a service method to re-fetch the list of processes here.
  }
}
