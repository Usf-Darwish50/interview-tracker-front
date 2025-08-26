import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FeebackService } from '../service/feeback.service';

@Component({
  selector: 'app-view-feedback',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-feedback.component.html',
  styleUrl: './view-feedback.component.css',
})
export class ViewFeedbackComponent {
  @Input() candidateId!: number;
  @Output() closeDialog = new EventEmitter<void>();

  feedbacks: any[] = [];
  currentIndex: number = 0;

  constructor(private feedbackService: FeebackService) {}
  ngOnInit(): void {
    this.feedbackService.getFeedbackForCandidate(this.candidateId).subscribe({
      next: (data) => {
        this.feedbacks = data;
        console.log('Fetched feedbacks:', this.feedbacks);
      },
      error: (error) => {
        console.error('Error fetching feedbacks:', error);
        // You might want to handle this more gracefully, e.g., show an error message in the dialog
      },
    });
  }

  get currentFeedback(): any {
    return this.feedbacks[this.currentIndex];
  }

  nextFeedback(): void {
    if (this.currentIndex < this.feedbacks.length - 1) {
      this.currentIndex++;
    }
  }

  previousFeedback(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }
}
