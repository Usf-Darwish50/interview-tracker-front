import { Component } from '@angular/core';
import { Candidate } from '../models/candidate.model';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CandidateService } from '../services/candidate.service';

@Component({
  selector: 'app-candidate-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './candidate-profile.component.html',
  styleUrl: './candidate-profile.component.css',
})
export class CandidateProfileComponent {
  candidate: Candidate | undefined;
  interviewStages = [
    {
      id: 1,
      name: 'Phone Interview',
      icon: 'phone',
      status: 'REJECTED',
      feedback: true,
    },
    {
      id: 2,
      name: 'Problem Solving Interview',
      icon: 'document',
      status: 'PENDING',
      feedback: false,
    },
    {
      id: 3,
      name: 'Technical Interview',
      icon: 'monitor',
      status: 'PENDING',
      feedback: false,
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private candidateService: CandidateService // Inject the service
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const candidateId = Number(params.get('id')); // Get the ID from the URL
      if (candidateId) {
        this.candidateService
          .findCandidateById(candidateId)
          .subscribe((data) => {
            this.candidate = data;
            // Here you can use the candidate data to update the interview stages, etc.
            // For now, we will just log the data to confirm it works.
            console.log('Fetched candidate data:', this.candidate);
          });
      }
    });
  }

  viewCV(): void {
    if (this.candidate && this.candidate.cvUrl) {
      window.open(this.candidate.cvUrl, '_blank');
    } else {
      console.error('Candidate or CV URL is not available.');
    }
  }

  viewFeedback(stageId: number): void {
    console.log('View feedback for stage:', stageId);
  }
}
