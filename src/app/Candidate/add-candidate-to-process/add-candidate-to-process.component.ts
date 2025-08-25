import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Candidate } from '../models/candidate.model';
import { CandidateService } from '../services/candidate.service';
import { catchError, forkJoin, of } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-candidate-to-process',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-candidate-to-process.component.html',
  styleUrl: './add-candidate-to-process.component.css',
})
export class AddCandidateToProcessComponent {
  @Input() candidates: Candidate[] = [];
  @Input() processId!: number;
  @Output() candidateAssigned = new EventEmitter<void>();
  @Output() closeDialog = new EventEmitter<void>();
  selectedCandidateId: number | null = null;
  selectedCandidateIds: number[] = [];

  constructor(private candidateService: CandidateService) {}

  onCandidateSelect(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const candidateId = Number(inputElement.value);

    if (inputElement.checked) {
      this.selectedCandidateIds.push(candidateId);
    } else {
      this.selectedCandidateIds = this.selectedCandidateIds.filter(
        (id) => id !== candidateId
      );
    }
  }

  assignCandidates(): void {
    if (this.selectedCandidateIds.length === 0) {
      return;
    }

    // Create an array of Observables for each API call
    const assignmentCalls = this.selectedCandidateIds.map((candidateId) =>
      this.candidateService
        .assignCandidateToProcess(candidateId, this.processId)
        .pipe(
          catchError((err) => {
            console.error(`Failed to assign candidate ${candidateId}:`, err);
            return of(null); // Return an observable of null to keep the stream alive
          })
        )
    );

    // Use forkJoin to run all assignments in parallel
    forkJoin(assignmentCalls).subscribe({
      next: (results) => {
        console.log('All assignment calls completed:', results);
        this.candidateAssigned.emit(); // Emit once all are done (or attempted)
      },
      error: (err) => {
        // This won't run if you're using catchError on individual calls
        console.error('An error occurred with one of the assignments.', err);
      },
    });
  }
}
