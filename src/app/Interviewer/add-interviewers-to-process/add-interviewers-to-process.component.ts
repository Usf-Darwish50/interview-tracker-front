import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Interviewer } from '../model/interviewer.model';
import { InterviewerService } from '../service/interviewer.service';
import { catchError, forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-add-interviewers-to-process',
  standalone: true,
  imports: [],
  templateUrl: './add-interviewers-to-process.component.html',
  styleUrl: './add-interviewers-to-process.component.css',
})
export class AddInterviewersToProcessComponent {
  @Input() interviewers: Interviewer[] = [];
  @Input() processId!: number;
  @Output() interviewerAssigned = new EventEmitter<void>();
  @Output() closeDialog = new EventEmitter<void>();
  selectedInterviewerIds: number[] = [];

  constructor(private interviewerService: InterviewerService) {} // Inject the new service

  onInterviewerSelect(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const interviewerId = Number(inputElement.value);

    if (inputElement.checked) {
      this.selectedInterviewerIds.push(interviewerId);
    } else {
      this.selectedInterviewerIds = this.selectedInterviewerIds.filter(
        (id) => id !== interviewerId
      );
    }
  }

  assignInterviewers(): void {
    if (this.selectedInterviewerIds.length === 0) {
      return;
    }

    const assignmentCalls = this.selectedInterviewerIds.map((interviewerId) =>
      this.interviewerService
        .assignInterviewerToProcess(interviewerId, this.processId) // Use the correct service method
        .pipe(
          catchError((err) => {
            console.error(
              `Failed to assign interviewer ${interviewerId}:`,
              err
            );
            return of(null);
          })
        )
    );

    forkJoin(assignmentCalls).subscribe({
      next: (results) => {
        console.log('All interviewer assignment calls completed:', results);
        this.interviewerAssigned.emit();
      },
      error: (err) => {
        console.error(
          'An error occurred with one of the interviewer assignments.',
          err
        );
      },
    });
  }
}
