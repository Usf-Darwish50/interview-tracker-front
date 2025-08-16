import { Injectable } from '@angular/core';
import { Candidate } from '../models/candidate.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  private apiUrl =
    'https://interview-tracker-backend-production.up.railway.app/interview-tracker/api/candidates';

  constructor(private http: HttpClient) {}

  /**
   * Sends a POST request to create a new candidate.
   * @param candidateData The data for the new candidate.
   * @returns An Observable of the API response.
   */
  createCandidate(candidateData: Candidate): Observable<any> {
    return this.http.post(this.apiUrl, candidateData);
  }
}
