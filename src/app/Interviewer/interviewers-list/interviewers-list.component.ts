import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Interviewer } from '../model/interviewer.model';
import { InterviewerService } from '../service/interviewer.service';

@Component({
  selector: 'app-interviewers-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './interviewers-list.component.html',
  styleUrl: './interviewers-list.component.css',
})
export class InterviewersListComponent {
  interviewers: Interviewer[] = [];
  notificationMessage: string = '';

  constructor(
    private interviewerService: InterviewerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchInterviewers();
  }

  /**
   * Fetches all interviewers from the API.
   */
  fetchInterviewers(): void {
    this.interviewerService.getAllInterviewers().subscribe({
      next: (data) => {
        this.interviewers = data;
      },
      error: (err) => {
        console.error('Failed to fetch interviewers:', err);
        // Handle error, e.g., show a user-facing message
      },
    });
  }

  /**
   * Deletes an interviewer by their ID.
   * @param interviewerId The ID of the interviewer to delete.
   */
  deleteInterviewer(interviewerId: number): void {
    this.interviewerService.deleteInterviewer(interviewerId).subscribe({
      next: () => {
        this.interviewers = this.interviewers.filter(
          (i) => i.interviewerId !== interviewerId
        );
        this.showNotification('Interviewer deleted successfully');
      },
      error: (err) => {
        console.error('Error deleting interviewer:', err);
        this.showNotification('Failed to delete interviewer');
      },
    });
  }

  /**
   * Displays a notification message for a short period.
   * @param message The message to display.
   */
  showNotification(message: string): void {
    this.notificationMessage = message;
    setTimeout(() => {
      this.notificationMessage = '';
    }, 3000);
  }

  /**
   * Navigates to the interviewer's profile page.
   * @param interviewer The interviewer object to view.
   */
  viewInterviewer(interviewer: Interviewer): void {
    this.router.navigate(['/interviewer-profile', interviewer.interviewerId]);
  }
}
