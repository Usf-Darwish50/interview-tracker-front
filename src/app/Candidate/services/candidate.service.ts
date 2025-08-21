import { Injectable } from '@angular/core';
import { Candidate, newCandidate } from '../models/candidate.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  private apiUrl = `${environment.apiUrl}/candidates`;

  constructor(private http: HttpClient) {}

  /**
   * Sends a POST request to create a new candidate.
   * @param candidateData The data for the new candidate.
   * @returns An Observable of the API response.
   */
  createCandidate(candidateData: newCandidate): Observable<any> {
    return this.http.post(this.apiUrl, candidateData);
  }

  /**
   * Sends a GET request to retrieve all candidates.
   * @returns An Observable of an array of Candidate objects.
   */
  getCandidates(): Observable<Candidate[]> {
    return this.http.get<Candidate[]>(this.apiUrl);
  }

  /**
   * Sends a DELETE request to remove a candidate by ID.
   * @param candidateId The ID of the candidate to delete.
   * @returns An Observable of the API response.
   */
  deleteCandidate(candidateId: number): Observable<any> {
    const url = `${this.apiUrl}/${candidateId}`;
    return this.http.delete(url);
  }

  /**
   * Sends a DELETE request to remove a candidate by ID.
   * @param candidateId The ID of the candidate to delete.
   * @returns An Observable of the API response.
   */
  findCandidateById(candidateId: number): Observable<any> {
    const url = `${this.apiUrl}/${candidateId}`;
    return this.http.get(url);
  }
}
