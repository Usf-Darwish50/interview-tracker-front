import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CandidateService } from '../services/candidate.service';
import { newCandidate } from '../models/candidate.model';
import { catchError, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-create-candidate',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-candidate.component.html',
  styleUrl: './create-candidate.component.css',
})
export class CreateCandidateComponent {
  candidateForm!: FormGroup;
  showSuccessMessage: boolean = false;
  isSubmitting: boolean = false;

  phonePattern = /^[+]{0,1}[0-9\s-()]{7,20}$/;
  urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;

  constructor(
    private formBuilder: FormBuilder,
    private candidateService: CandidateService
  ) {}

  ngOnInit(): void {
    this.candidateForm = this.formBuilder.group({
      fullName: [
        '',
        [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)],
      ],
      phone: ['', [Validators.required, Validators.pattern(this.phonePattern)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      resumeUrl: [
        '',
        [Validators.required, Validators.pattern(this.urlPattern)],
      ],
      position: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  onSubmit(): void {
    if (this.candidateForm.invalid) {
      this.candidateForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    this.candidateService
      .createCandidate(this.candidateForm.value as newCandidate)
      .pipe(
        catchError((error) => {
          console.error('There was an error creating the candidate:', error);
          this.isSubmitting = false;
          return throwError(
            () => new Error('Something went wrong. Please try again later.')
          );
        })
      )
      .subscribe({
        next: (response) => {
          console.log('Candidate created successfully!', response);
          this.showSuccessMessage = true;
          this.isSubmitting = false;

          setTimeout(() => {
            this.showSuccessMessage = false;
            this.candidateForm.reset();
          }, 1500);
        },
        error: (err) => {
          console.error('API call failed:', err);
          console.log(
            'Failed to create candidate. Please check the form and try again.'
          );
          this.isSubmitting = false;
        },
      });
  }
}
