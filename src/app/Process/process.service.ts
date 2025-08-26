import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Candidate } from '../Candidate/models/candidate.model';

@Injectable({
  providedIn: 'root',
})
export class ProcessService {
  private apiUrl = `${environment.apiUrl}/processes`;

  constructor(private http: HttpClient) {}

  /**
   * Sends a POST request to create a new process.
   * @param processData The data for the new process.
   * @returns An Observable of the API response.
   */
  createProcess(processData: any): Observable<any> {
    return this.http.post(this.apiUrl, processData);
  }

  /**
   * Fetches a single process by its ID.
   * @param id The ID of the process to fetch.
   * @returns An Observable of the process data.
   */
  getProcessById(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get(url);
  }

  /**
   * Fetches a single process by its ID.
   * @param id The ID of the process to fetch.
   * @returns An Observable of the process data.
   */
  getAllProcesses(): Observable<any[]> {
    const url = `${this.apiUrl}`;
    return this.http.get<any[]>(this.apiUrl);
  }

  /**
   * Ends a process by setting its status to 'COMPLETED'.
   * @param id The ID of the process to end.
   * @returns An Observable of the API response.
   */
  endProcess(id: number): Observable<any> {
    const url = `${this.apiUrl}/end/${id}`;
    return this.http.put(url, {}); // PUT requests often require a body, even if it's empty
  }

  /**
   * Sends a GET request to retrieve all candidates for a specific process.
   * @param processId The ID of the process.
   * @returns An Observable of an array of Candidate objects.
   */
  getCandidatesForProcess(processId: number): Observable<Candidate[]> {
    const url = `${this.apiUrl}/${processId}/candidates`;
    return this.http.get<Candidate[]>(url);
  }

  /**
   * Fetches the number of candidates for a specific process.
   * @param processId The ID of the process.
   * @returns An Observable of the candidate count.
   */
  getCandidatesCountForProcess(processId: number): Observable<number> {
    const url = `${this.apiUrl}/${processId}/candidates/count`;
    return this.http.get<number>(url);
  }
}
