import { Injectable } from '@angular/core';
import {
  Candidate,
  CandidateDetailDTO,
  newCandidate,
} from '../models/candidate.model';
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

  /**
   * Sends a GET request to retrieve a candidate's full details, including process ID.
   * This uses the new backend DTO endpoint.
   * @param candidateId The ID of the candidate to find.
   * @returns An Observable of the CandidateDetailDTO object.
   */
  findCandidateDetailsById(
    candidateId: number
  ): Observable<CandidateDetailDTO> {
    const url = `${this.apiUrl}/details/${candidateId}`;
    return this.http.get<CandidateDetailDTO>(url);
  }

  /**
   * Assigns a candidate to a specific hiring process.
   * @param candidateId The ID of the candidate to assign.
   * @param processId The ID of the process to assign the candidate to.
   * @returns An Observable of the API response.
   */
  assignCandidateToProcess(
    candidateId: number,
    processId: number
  ): Observable<any> {
    const url = `${this.apiUrl}/${candidateId}/assign/${processId}`;
    // The PUT request body can be empty if the API doesn't require one.
    return this.http.put(url, {});
  }
}
