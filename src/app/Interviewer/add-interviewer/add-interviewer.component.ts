import { Component, EventEmitter, Output } from '@angular/core';
import { Interviewer } from '../model/interviewer.model';
import { InterviewerService } from '../service/interviewer.service';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-add-interviewer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-interviewer.component.html',
  styleUrl: './add-interviewer.component.css',
})
export class AddInterviewerComponent {
  interviewerForm!: FormGroup;
  notificationMessage: string = '';

  showSuccessMessage: boolean = false;
  isSubmitting: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private interviewerService: InterviewerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.interviewerForm = this.formBuilder.group({
      username: [
        '',
        Validators.required,
        // Corrected to minLength 5 as requested
        Validators.minLength(5),
        // Pattern validator correctly checks for at least one letter and one number
        Validators.pattern('^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{5,}$'),
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[\w.-]+@(gmail|yahoo|outlook|ntgclarity)\.com$/),
          Validators.email,
        ],
      ],
      phone: [
        '',
        [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)],
      ],
      position: ['', [Validators.required, Validators.minLength(3)]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern('^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{5,}$'),
        ],
      ],
    });
  }

  onSubmit(): void {
    if (this.interviewerForm.invalid) {
      this.interviewerForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    this.interviewerService
      .addInterviewer(this.interviewerForm.value as Interviewer)
      .pipe(
        catchError((error) => {
          console.error('There was an error creating the interviewer:', error);
          this.isSubmitting = false;
          return throwError(
            () => new Error('Something went wrong. Please try again later.')
          );
        })
      )
      .subscribe({
        next: (response) => {
          console.log('Interviewer created successfully!', response);
          this.showSuccessMessage = true;
          this.isSubmitting = false;

          setTimeout(() => {
            this.showSuccessMessage = false;
            this.interviewerForm.reset();
          }, 1500);
        },
        error: (err) => {
          console.error('API call failed:', err);
        },
      });
  }
}
