import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoginService } from '../login.service';
import { Route, Router } from '@angular/router';
import { Credentials } from '../login.model';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm!: FormGroup;
  isSubmitting: boolean = false;
  showErrorMessage: boolean = false;
  errorMessage: string = '';
  showSuccessMessage: boolean = false;
  loggedInUser: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initialize the form with username and password fields.
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  /**
   * @description
   * Handles the form submission for user login.
   * It validates the form, calls the login service, and manages UI states.
   */
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.showErrorMessage = false;

    // Call the login service with form data.
    this.loginService
      .login(this.loginForm.value as Credentials)
      .pipe(
        // Use catchError to gracefully handle HTTP errors from the API.
        catchError((error) => {
          console.error('Login failed:', error);
          this.isSubmitting = false;
          this.showErrorMessage = true;
          this.errorMessage =
            error.error?.message || 'Invalid username or password.';
          return throwError(() => new Error(this.errorMessage));
        })
      )
      .subscribe({
        next: (response) => {
          if (response.success && response.user) {
            console.log('Login successful!', response);
            // Store user data in localStorage.
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            // Set success message and user for display.
            this.showSuccessMessage = true;
            this.loggedInUser = response.user.username;

            setTimeout(() => {
              // Redirect to the dashboard or another page after a brief delay.
              this.router.navigate(['/dashboard']);
            }, 1500);
          } else {
            // Handle cases where the API returns a non-error status but a failed login.
            this.showErrorMessage = true;
            this.errorMessage =
              response.message || 'Login failed. Please try again.';
            this.isSubmitting = false;
          }
        },
        error: (err) => {
          // This block catches any unhandled errors, although catchError should handle most.
          console.error('API call failed:', err);
          this.isSubmitting = false;
        },
      });
  }
}
