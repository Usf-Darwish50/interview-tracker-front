import { Component } from '@angular/core';
import { Candidate } from '../models/candidate.model';
import { CandidateService } from '../services/candidate.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-candidates',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './candidates.component.html',
  styleUrl: './candidates.component.css',
})
export class CandidatesComponent {
  candidates: Candidate[] = [];
  notificationMessage: string = '';

  constructor(
    private candidateService: CandidateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.candidateService.getCandidates().subscribe((data) => {
      this.candidates = data;
    });
  }
  /**
   * Deletes a candidate by their ID and updates the list after deletion.
   * @param candidateId The ID of the candidate to delete.
   */
  deleteCandidate(candidateId: number): void {
    this.candidateService.deleteCandidate(candidateId).subscribe(
      () => {
        // Filter out the deleted candidate from the local array to update the UI
        this.candidates = this.candidates.filter(
          (c) => c.candidateId !== candidateId
        );
        console.log(`Candidate with ID ${candidateId} deleted successfully.`);
        this.showNotification('Candidate Deleted sucessfully');
      },
      (error) => {
        console.error('Error deleting candidate:', error);
      }
    );
  }

  /**
   * Displays a notification message for a short period of time.
   * @param message The message to display.
   */
  showNotification(message: string): void {
    this.notificationMessage = message;
    setTimeout(() => {
      this.notificationMessage = '';
    }, 3000); // Hide the message after 3 seconds
  }

  /**
   * Views a candidate by fetching their details from the API.
   * Currently just logs the candidate data to the console.
   * @param candidateId The ID of the candidate to view.
   */
  viewCandidate(candidate: Candidate): void {
    this.router.navigate(['/candidate-profile', candidate.candidateId]);
  }
}
