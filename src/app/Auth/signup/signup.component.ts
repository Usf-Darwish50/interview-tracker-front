import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ManagerService } from '../../Manager/manager.service';
import { NewManager } from '../../Manager/manager.model';
import { catchError, throwError } from 'rxjs';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  signupForm!: FormGroup;
  showSuccessMessage: boolean = false;
  isSubmitting: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private managerService: ManagerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      username: [
        '',
        [
          Validators.required,
          // Corrected to minLength 5 as requested
          Validators.minLength(5),
          // Pattern validator correctly checks for at least one letter and one number
          Validators.pattern('^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{5,}$'),
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|outlook|ntgclarity)\.com$/
          ),

          Validators.email,
        ],
      ],
      phone: [
        '',
        [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)],
      ],
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
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const newManagerData: NewManager = this.signupForm.value as NewManager;

    this.managerService
      .createManager(newManagerData)
      .pipe(
        catchError((error) => {
          console.error('Error during manager signup:', error);
          this.isSubmitting = false;
          // You could add a user-facing error message here
          return throwError(
            () => new Error('Signup failed. Please try again.')
          );
        })
      )
      .subscribe({
        next: (response) => {
          console.log('Manager created successfully!', response);
          this.showSuccessMessage = true;
          this.isSubmitting = false;

          setTimeout(() => {
            this.showSuccessMessage = false;
            this.signupForm.reset();
            this.router.navigate(['/login']);
          }, 1500);
        },
        error: (err) => {
          console.error('API call failed:', err);
          this.isSubmitting = false;
        },
      });
  }
}
