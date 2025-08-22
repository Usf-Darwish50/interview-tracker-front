import { Component } from '@angular/core';
import { HiringProcessProfile } from '../model/process.model';
import { ProcessService } from '../process.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AddProcessComponent } from '../add-process/add-process.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-processes',
  standalone: true,
  imports: [CommonModule, AddProcessComponent],
  templateUrl: './processes.component.html',
  styleUrl: './processes.component.css',
})
export class ProcessesComponent {
  processes: HiringProcessProfile[] = [];
  activeProcesses$!: Observable<HiringProcessProfile[]>;

  showAddProcessDialog = false;
  managerId = 1;

  constructor(private processService: ProcessService, private router: Router) {}

  ngOnInit(): void {
    this.processService.getAllProcesses().subscribe(
      (data) => {
        this.processes = data;
      },
      (error) => {
        console.error('Error fetching processes:', error);
      }
    );
  }

  onAddProcessClick() {
    this.showAddProcessDialog = true;
  }
  onProcessCreated() {
    console.log('Process created. Refreshing dashboard data...');
    this.activeProcesses$ = this.processService.getAllProcesses();
    this.showAddProcessDialog = false;
  }

  /**
   * Navigates to the details page for a specific process.
   * @param process The process object to view.
   */
  viewProcess(process: HiringProcessProfile): void {
    this.router.navigate(['/process-profile', process.processId]);
  }

  /**
   * Formats the status string for display.
   * @param status The status string from the API (e.g., 'NOT_STARTED').
   * @returns A formatted string (e.g., 'Not Started').
   */
  formatStatus(status: string): string {
    const formatted = status.toLowerCase().replace(/_/g, ' ');
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }
}
