import { Component } from '@angular/core';
import { Candidate, CandidateDetailDTO } from '../models/candidate.model';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CandidateService } from '../services/candidate.service';
import { StageService } from '../../Stage/stage.service';
import { of, switchMap, tap } from 'rxjs';
import { ProcessService } from '../../Process/process.service';
import { AddFeedbackComponent } from '../../Feedback/add-feedback/add-feedback.component';
import { FeebackService } from '../../Feedback/service/feeback.service';
import { ViewFeedbackComponent } from '../../Feedback/view-feedback/view-feedback.component';

@Component({
  selector: 'app-candidate-profile',
  standalone: true,
  imports: [CommonModule, AddFeedbackComponent, ViewFeedbackComponent],
  templateUrl: './candidate-profile.component.html',
  styleUrl: './candidate-profile.component.css',
})
export class CandidateProfileComponent {
  candidate: CandidateDetailDTO | undefined | null;
  interviewStages: any[] = [];
  processId: number | undefined;
  processTitle: string | undefined;

  // State variables for dialogs
  showAddFeedbackDialog = false;
  showViewFeedbackDialog = false;

  selectedStageId!: number;
  selectedInterviewerId!: number;

  candidateFeedbacks: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private candidateService: CandidateService,
    private stageService: StageService,
    private processService: ProcessService,
    private feedbackService: FeebackService
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const candidateId = Number(params.get('id'));
          if (candidateId && !isNaN(candidateId)) {
            return this.candidateService.findCandidateDetailsById(candidateId);
          }
          return of(null);
        }),
        tap((candidateData) => {
          this.candidate = candidateData;
        }),
        switchMap(() => {
          if (this.candidate && this.candidate.hiringProcessId) {
            this.processId = this.candidate.hiringProcessId;
            return this.processService.getProcessById(this.processId);
          } else {
            return of(null);
          }
        }),
        tap((processData) => {
          this.processTitle = processData?.title;
        }),
        switchMap(() => {
          if (this.processId) {
            return this.stageService.getStagesByProcessId(this.processId);
          } else {
            return of([]);
          }
        }),
        tap((stages) => {
          this.interviewStages = stages;
        }),
        switchMap(() => {
          if (this.candidate?.candidateId) {
            return this.feedbackService.getFeedbackForCandidate(
              this.candidate.candidateId
            );
          } else {
            return of([]);
          }
        })
      )
      .subscribe((feedbacks) => {
        this.candidateFeedbacks = feedbacks;
        console.log('Profile loaded with feedbacks:', this.candidateFeedbacks);
      });
  }

  viewCV(): void {
    if (this.candidate && this.candidate.cvUrl) {
      window.open(this.candidate.cvUrl, '_blank');
    } else {
      console.error('Candidate or CV URL is not available.');
    }
  }

  // Method to open the Add Feedback dialog
  openAddFeedbackDialog(stageId: number, interviewerId: number): void {
    this.selectedStageId = stageId;
    this.selectedInterviewerId = interviewerId;
    this.showAddFeedbackDialog = true;
  }

  // Method to close the Add Feedback dialog and refresh feedback data
  onAddDialogClose(): void {
    this.showAddFeedbackDialog = false;
    if (this.candidate?.candidateId) {
      this.feedbackService
        .getFeedbackForCandidate(this.candidate.candidateId)
        .subscribe((feedbacks) => {
          this.candidateFeedbacks = feedbacks;
        });
    }
  }

  // Old method that shows an alert
  viewAllFeedbacks(): void {
    console.log(
      'Viewing all feedbacks for candidate:',
      this.candidateFeedbacks
    );
    if (this.candidateFeedbacks.length > 0) {
      alert(
        'Feedbacks:\n' +
          this.candidateFeedbacks.map((f) => f.feedbackText).join('\n')
      );
    } else {
      alert('No feedback available.');
    }
  }

  // Corrected method to open the dialog
  openViewFeedbackDialog(): void {
    this.showViewFeedbackDialog = true;
  }

  // Method to close the View Feedback dialog
  onViewDialogClose(): void {
    this.showViewFeedbackDialog = false;
  }

  getStageIcon(title: string): string {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.startsWith('phone')) {
      return 'phone';
    } else if (lowerTitle.startsWith('technical')) {
      return 'monitor';
    } else if (lowerTitle.startsWith('hr')) {
      return 'business-bag';
    }
    return 'document';
  }

  formatStatus(status: string): string {
    const formatted = status.toLowerCase().replace(/_/g, ' ');
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }
}
