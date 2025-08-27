import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InterviewerService } from '../service/interviewer.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-unassign-interviewer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button class="btn-danger" (click)="onUnassign()">Unassign</button>
  `,
  styleUrl: './unassign-interviewer.component.css',
})
export class UnassignInterviewerComponent {
  @Input() interviewerId!: number;
  @Output() interviewerUnassigned = new EventEmitter<void>();

  constructor(private interviewerService: InterviewerService) {}

  onUnassign(): void {
    if (!this.interviewerId) {
      console.error('Interviewer ID not provided for unassignment.');
      return;
    }

    this.interviewerService
      .unassignInterviewerFromProcess(this.interviewerId)
      .subscribe({
        next: (response) => {
          console.log('Interviewer unassigned successfully:', response);
          this.interviewerUnassigned.emit();
        },
        error: (err) => {
          console.error('Failed to unassign interviewer:', err);
        },
      });
  }
}
