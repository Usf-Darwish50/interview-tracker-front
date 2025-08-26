import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FeebackService } from '../service/feeback.service';

@Component({
  selector: 'app-add-feedback',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-feedback.component.html',
  styleUrl: './add-feedback.component.css',
})
export class AddFeedbackComponent implements OnInit {
  @Input() candidateId!: number;
  @Input() stageId!: number;
  @Input() interviewerId!: number;
  @Output() closeDialog = new EventEmitter<void>();

  feedbackForm!: FormGroup;
  isSubmitting = false;
  showSuccessMessage = false;

  constructor(
    private formBuilder: FormBuilder,
    private feedbackService: FeebackService // Added this
  ) {}

  ngOnInit(): void {
    this.feedbackForm = this.formBuilder.group({
      feedbackText: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.feedbackForm.invalid) {
      this.feedbackForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.feedbackForm.disable();

    const payload = {
      feedbackText: this.feedbackForm.value.feedbackText,
      candidateId: this.candidateId,
    };

    console.log('Payload being sent:', payload);

    this.feedbackService.submitFeedback(payload).subscribe({
      next: (response) => {
        console.log('Feedback submitted successfully:', response);
        this.showSuccessMessage = true;
        this.isSubmitting = false;
        setTimeout(() => {
          this.closeDialog.emit();
        }, 2000);
      },
      error: (error) => {
        console.error('Error submitting feedback:', error);
        this.isSubmitting = false;
        this.feedbackForm.enable();
      },
    });
  }

  onDialogClose(): void {
    this.closeDialog.emit();
    this.feedbackForm.enable();
  }
}
