import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CandidateService } from '../services/candidate.service';
import { Candidate } from '../models/candidate.model';
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
  constructor(
    private formBuilder: FormBuilder,
    private candidateService: CandidateService
  ) {}

  ngOnInit(): void {
    this.candidateForm = this.formBuilder.group({
      // Add validators to ensure fields are not empty
      fullName: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]], // Added email validator
      resumeUrl: ['', Validators.required],
      position: ['', Validators.required],
    });
  }
  onSubmit(): void {
    console.log('Submitting form...'); // <-- Log to check if the function is called

    if (this.candidateForm.valid) {
      console.log('Form is valid. Submitting data:', this.candidateForm.value); // <-- Log the form data
      this.candidateService
        .createCandidate(this.candidateForm.value as Candidate)
        .pipe(
          catchError((error) => {
            console.error('There was an error creating the candidate:', error);
            // Re-throw the error so the subscribe's error handler can catch it
            return throwError(
              () => new Error('Something went wrong. Please try again later.')
            );
          })
        )
        .subscribe({
          next: (response) => {
            console.log('Candidate created successfully!', response);
            // Replace alert with console.log for better debugging experience
            console.log('Candidate created successfully!');
            this.candidateForm.reset(); // Clear the form on success
          },
          error: (err) => {
            console.error('API call failed:', err);
            // Replace alert with console.log for better debugging experience
            console.log(
              'Failed to create candidate. Please check the form and try again.'
            );
          },
        });
    } else {
      console.log('Form is invalid.');
      console.log('Please fill out all required fields.');
    }
  }
}
