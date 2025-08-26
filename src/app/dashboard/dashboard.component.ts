import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AddProcessComponent } from '../Process/add-process/add-process.component';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { HiringProcessProfile } from '../Process/model/process.model';
import { ProcessService } from '../Process/process.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, AddProcessComponent, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  processDistribution = {
    completed: 45,
    inProgress: 35,
    cancelled: 20,
  };

  activeProcesses$!: Observable<HiringProcessProfile[]>;

  showAddProcessDialog = false;
  managerId = 1;

  constructor(private processService: ProcessService) {}

  ngOnInit(): void {
    this.activeProcesses$ = this.processService.getAllProcesses();
    this.fetchProcessesWithCount();
  }

  onAddProcessClick() {
    this.showAddProcessDialog = true;
  }

  onProcessCreated() {
    console.log('Process created. Refreshing dashboard data...');
    this.showAddProcessDialog = false;
    this.fetchProcessesWithCount();
  }

  private fetchProcessesWithCount(): void {
    this.activeProcesses$ = this.processService.getAllProcesses().pipe(
      // Switch to a new observable that fetches the count for each process
      switchMap((processes) => {
        if (!processes || processes.length === 0) {
          return of([]); // Return an empty array if there are no processes
        }

        // Create an array of observables for fetching the count of each process
        const processWithCountObservables = processes.map((process) =>
          this.processService
            .getCandidatesCountForProcess(process.processId)
            .pipe(
              map((count) => ({ ...process, candidateCount: count })) // Map the count back into the process object
            )
        );
        return forkJoin(processWithCountObservables);
      })
    );
  }
}
