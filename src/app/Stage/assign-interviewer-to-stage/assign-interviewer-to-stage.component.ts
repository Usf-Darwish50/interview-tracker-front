import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Stage } from '../model/stage.model';
import { Interviewer } from '../../Interviewer/model/interviewer.model';
import { InterviewerService } from '../../Interviewer/service/interviewer.service';
import { StageService } from '../stage.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-assign-interviewer-to-stage',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assign-interviewer-to-stage.component.html',
  styleUrl: './assign-interviewer-to-stage.component.css',
})
export class AssignInterviewerToStageComponent {
  @Input() processId!: number;
  @Input() stages!: Stage[];
  @Output() closeDialog = new EventEmitter<void>();
  @Output() interviewersAssigned = new EventEmitter<void>();

  selectedStageId: number | null = null;
  allInterviewers: Interviewer[] = [];
  selectedInterviewers: Interviewer[] = [];

  // Exclude interviewers that are already assigned
  availableInterviewers: Interviewer[] = [];

  constructor(
    private interviewerService: InterviewerService,
    private stageService: StageService
  ) {}
  ngOnInit(): void {
    this.interviewerService.getAllInterviewers().subscribe((interviewers) => {
      this.allInterviewers = interviewers;
      this.updateAvailableInterviewers();
    });
  }

  onStageSelect(): void {
    this.updateAvailableInterviewers();
  }

  updateAvailableInterviewers(): void {
    if (!this.stages || this.selectedStageId === null) {
      this.availableInterviewers = [...this.allInterviewers];
      return;
    }
    const selectedStage = this.stages.find(
      (s) => s.stageId === this.selectedStageId
    );
    if (selectedStage) {
      const assignedIds = new Set(
        selectedStage.assignedInterviewers.map((i: any) => i.interviewerId)
      );
      this.availableInterviewers = this.allInterviewers.filter(
        (interviewer) => !assignedIds.has(interviewer.interviewerId)
      );
    }
  }

  addInterviewer(interviewer: Interviewer): void {
    if (
      !this.selectedInterviewers.some(
        (i) => i.interviewerId === interviewer.interviewerId
      )
    ) {
      this.selectedInterviewers.push(interviewer);
    }
  }

  removeInterviewer(interviewer: Interviewer): void {
    this.selectedInterviewers = this.selectedInterviewers.filter(
      (i) => i.interviewerId !== interviewer.interviewerId
    );
  }

  assignInterviewers(): void {
    if (!this.selectedStageId || this.selectedInterviewers.length === 0) {
      alert('Please select a stage and at least one interviewer.');
      return;
    }

    const interviewerIds = this.selectedInterviewers.map(
      (i) => i.interviewerId
    );

    this.stageService
      .assignInterviewersToStage(
        this.processId,
        this.selectedStageId,
        interviewerIds
      )
      .subscribe({
        next: () => {
          console.log('Interviewers assigned successfully.');
          this.interviewersAssigned.emit(); // Notify parent to refresh
          this.onClose();
        },
        error: (error) => {
          console.error('Error assigning interviewers:', error);
          alert('Failed to assign interviewers. Please try again.');
        },
      });
  }

  onClose(): void {
    this.closeDialog.emit();
  }
}
