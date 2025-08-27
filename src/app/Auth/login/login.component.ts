// src/app/login/login.component.ts
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
import { UserStateService } from '../user-state.service';

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
    private router: Router,
    private userService: UserStateService // Add this to the constructor
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.showErrorMessage = false;

    this.loginService
      .login(this.loginForm.value as Credentials)
      .pipe(
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
            // Replace localStorage.setItem with the UserService login method
            this.userService.login(response.user);

            this.showSuccessMessage = true;
            this.loggedInUser = response.user.username;
            console.log(this.loggedInUser);

            setTimeout(() => {
              this.router.navigate(['/dashboard']);
            }, 1500);
          } else {
            this.showErrorMessage = true;
            this.errorMessage =
              response.message || 'Login failed. Please try again.';
            this.isSubmitting = false;
          }
        },
        error: (err) => {
          console.error('API call failed:', err);
          this.isSubmitting = false;
        },
      });
  }
  onSignUpClicked() {
    console.log('sign up');
  }
}
