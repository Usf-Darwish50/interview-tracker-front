import { Component, OnInit } from '@angular/core';
import { Observable, switchMap, tap, BehaviorSubject } from 'rxjs';
import { ProcessService } from '../process.service';
import { ActivatedRoute, ParamMap, Route, Router } from '@angular/router';
import { HiringProcessProfile, ProcessStatus } from '../model/process.model';
import { CommonModule, DatePipe } from '@angular/common';
import { StageService } from '../../Stage/stage.service';
import { AddStageComponent } from '../../Stage/add-stage/add-stage.component';
import { Stage, StageStatus } from '../../Stage/model/stage.model';
import { AssignInterviewerToStageComponent } from '../../Stage/assign-interviewer-to-stage/assign-interviewer-to-stage.component';
import { Candidate } from '../../Candidate/models/candidate.model';
import { CandidateService } from '../../Candidate/services/candidate.service';
import { AddCandidateToProcessComponent } from '../../Candidate/add-candidate-to-process/add-candidate-to-process.component';

@Component({
  selector: 'app-process-profile',
  standalone: true,
  imports: [CommonModule, AddStageComponent, AddCandidateToProcessComponent],
  templateUrl: './process-profile.component.html',
  styleUrl: './process-profile.component.css',
})
export class ProcessProfileComponent implements OnInit {
  // Use a BehaviorSubject to manage the process data
  private processSubject = new BehaviorSubject<HiringProcessProfile | null>(
    null
  );
  process$ = this.processSubject.asObservable();

  isLoading = true;
  processStages: Stage[] = [];
  currentProcessId!: number;
  showAddStageDialog = false;
  showAssignInterviewerDialog = false;

  showAddCandidateDialog = false;
  candidates: Candidate[] = []; // To store the list of candidates

  processCandidates: Candidate[] = []; // New property to store candidates for this process
  activeTab: 'stages' | 'candidates' = 'stages'; // New property for tab state

  constructor(
    private route: ActivatedRoute,
    private processService: ProcessService,
    private stageService: StageService,
    private candidateService: CandidateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          const id = Number(params.get('id'));
          if (id) {
            this.currentProcessId = id;
            this.isLoading = true;
            this.fetchStages(id);
            this.fetchProcessDetails(); // Use the new method here
            this.fetchProcessCandidates(id); // Fetch candidates on component load

            return this.processService.getProcessById(id);
          } else {
            console.error('No process ID found in the URL.');
            this.isLoading = false;
            return new Observable<any>();
          }
        }),
        tap((processData: HiringProcessProfile) => {
          // Push the fetched data into the subject
          this.processSubject.next(processData);
          this.isLoading = false;
        })
      )
      .subscribe();
  }

  fetchStages(processId: number): void {
    this.stageService.getStagesByProcessId(processId).subscribe({
      next: (stages: Stage[]) => {
        this.processStages = stages.map((stage) => ({
          ...stage,
          // Initialize assignedInterviewers as an empty array if it's null or undefined
          assignedInterviewers: stage.assignedInterviewers || [],
          icon: this.getStageIcon(stage.title),
        }));
      },
      error: (err) => {
        console.error('Error fetching stages:', err);
      },
    });
  }

  getStageIcon(title: string): string {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.startsWith('phone')) {
      return 'phone';
    } else if (lowerTitle.startsWith('technical')) {
      return 'monitor';
    } else if (lowerTitle.startsWith('hr')) {
      return 'business-bag'; // New case for 'HR' titles
    }
    return 'document';
  }

  // NEW METHOD TO FIX THE TEMPLATE ERROR
  getAssignedInterviewerNames(interviewers: any[]): string {
    if (!interviewers || interviewers.length === 0) {
      return '';
    }
    return interviewers.map((i) => i.username).join(', ');
  }

  addStage(): void {
    this.showAddStageDialog = true;
  }

  closeAddStageDialog(): void {
    this.showAddStageDialog = false;
  }

  onStageCreated(newStage: Stage): void {
    this.closeAddStageDialog();
    this.fetchStages(this.currentProcessId);
  }

  endProcess(): void {
    const currentProcess = this.processSubject.getValue();
    if (currentProcess?.status === ProcessStatus.COMPLETED) {
      return;
    }

    this.processService.endProcess(this.currentProcessId).subscribe({
      next: () => {
        console.log('Process ended successfully.');
        // After ending, re-fetch the process to get the updated status
        this.processService.getProcessById(this.currentProcessId).subscribe({
          next: (updatedProcess: HiringProcessProfile) => {
            // Push the new, updated process into the subject
            this.processSubject.next(updatedProcess);
          },
          error: (err) => console.error('Error fetching updated process:', err),
        });
      },
      error: (error) => {
        console.error('Error ending process:', error);
      },
    });
  }

  assignInterviewer(): void {
    this.showAssignInterviewerDialog = true; // Open the dialog
  }

  closeAssignInterviewerDialog(): void {
    this.showAssignInterviewerDialog = false; // Close the dialog
  }

  onInterviewersAssigned(): void {
    // Refresh the stages to show the newly assigned interviewers
    this.fetchStages(this.currentProcessId);
  }

  moveToNextStage(stageId: number): void {
    const currentIndex = this.processStages.findIndex(
      (s) => s.stageId === stageId
    );
    if (currentIndex === -1) {
      console.error('Stage not found.');
      return;
    }

    const currentStage = { ...this.processStages[currentIndex] };
    const nextStage =
      currentIndex + 1 < this.processStages.length
        ? { ...this.processStages[currentIndex + 1] }
        : null;

    currentStage.status = StageStatus.COMPLETED;
    if (nextStage) {
      nextStage.status = StageStatus.IN_PROGRESS;
    }

    this.stageService
      .updateStage(this.currentProcessId, currentStage)
      .subscribe({
        next: () => {
          console.log(`Stage ${currentStage.title} marked as completed.`);
          if (nextStage) {
            this.stageService
              .updateStage(this.currentProcessId, nextStage)
              .subscribe({
                next: () => {
                  console.log(
                    `Stage ${nextStage.title} marked as in progress.`
                  );
                  this.fetchStages(this.currentProcessId);
                },
                error: (err) =>
                  console.error('Error updating next stage:', err),
              });
          } else {
            this.fetchStages(this.currentProcessId);
          }
        },
        error: (err) => console.error('Error updating stage:', err),
      });
  }

  formatStatus(status: string): string {
    const formatted = status.toLowerCase().replace(/_/g, ' ');
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }

  addCandidateToProcess(): void {
    // You should fetch the list of candidates here to populate the dialog
    this.candidateService.getCandidates().subscribe({
      next: (candidates) => {
        this.candidates = candidates;
        this.showAddCandidateDialog = true;
      },
      error: (err) => console.error('Error fetching candidates:', err),
    });
  }

  closeAddCandidateDialog(): void {
    this.showAddCandidateDialog = false;
  }

  // New method to fetch candidates for the process
  fetchProcessCandidates(processId: number): void {
    this.processService.getCandidatesForProcess(processId).subscribe({
      next: (candidates: Candidate[]) => {
        this.processCandidates = candidates;
      },
      error: (err) => {
        console.error('Error fetching candidates for process:', err);
      },
    });
  }

  // New method to switch tabs
  selectTab(tab: 'stages' | 'candidates'): void {
    this.activeTab = tab;
  }

  // Update the onCandidateAssigned method to also refresh the candidates list
  onCandidateAssigned(): void {
    console.log('Candidate assigned. Refreshing process data...');
    this.fetchProcessDetails();
    this.fetchProcessCandidates(this.currentProcessId); // Refresh the candidates list
    this.closeAddCandidateDialog();
  }

  // Add a helper method to re-fetch the main process details
  fetchProcessDetails(): void {
    this.processService.getProcessById(this.currentProcessId).subscribe({
      next: (processData) => this.processSubject.next(processData),
      error: (err) => console.error('Error fetching process details:', err),
    });
  }

  // New method to navigate to the candidate's profile
  viewCandidateProfile(candidateId: number): void {
    // Navigate to the 'candidate-profile' route with the candidate's ID
    this.router.navigate(['/candidate-profile', candidateId]);
  }
}
