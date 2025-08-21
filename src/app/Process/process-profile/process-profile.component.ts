import { Component, OnInit } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { ProcessService } from '../process.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { HiringProcessProfile } from '../model/process.model';
import { CommonModule, DatePipe } from '@angular/common';

// Define a placeholder for the stages as they are not yet implemented
const MOCK_PROCESS_STAGES = [
  { id: 1, name: 'Resume Review', status: 'IN_PROGRESS', icon: 'document' },
  { id: 2, name: 'Phone Screen', status: 'PENDING', icon: 'phone' },
  { id: 3, name: 'Technical Interview', status: 'PENDING', icon: 'monitor' },
  { id: 4, name: 'HR Interview', status: 'PENDING', icon: 'monitor' },
];

@Component({
  selector: 'app-process-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './process-profile.component.html',
  styleUrl: './process-profile.component.css',
})
export class ProcessProfileComponent implements OnInit {
  process$!: Observable<HiringProcessProfile>;
  isLoading = true;
  processStages = MOCK_PROCESS_STAGES; // Use the mock data for now
  stageStatusMessage: { [key: number]: string } = {};

  constructor(
    private route: ActivatedRoute,
    private processService: ProcessService
  ) {}

  ngOnInit(): void {
    this.process$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        const id = Number(params.get('id'));
        if (id) {
          this.isLoading = true;
          return this.processService.getProcessById(id);
        } else {
          console.error('No process ID found in the URL.');
          return new Observable<any>();
        }
      })
    );

    this.process$.subscribe({
      next: () => (this.isLoading = false),
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching process details:', err);
      },
    });
  }

  // Placeholder methods for new buttons
  addStage() {
    console.log('Add Stage button clicked.');
  }

  assignInterviewer() {
    console.log('Assign Interviewer button clicked.');
  }
  // Renamed method for clarity
  moveToNextStage(stageId: number) {
    const currentIndex = this.processStages.findIndex((s) => s.id === stageId);
    if (currentIndex !== -1) {
      // 1. Mark the current stage as COMPLETED
      this.processStages[currentIndex].status = 'COMPLETED';
      // Show the success message for this stage
      this.stageStatusMessage[stageId] = 'Completed';

      // 2. Find the next stage
      const nextStageIndex = currentIndex + 1;
      if (nextStageIndex < this.processStages.length) {
        // 3. Mark the next stage as IN_PROGRESS
        this.processStages[nextStageIndex].status = 'IN_PROGRESS';
      }
    }
  }
}
