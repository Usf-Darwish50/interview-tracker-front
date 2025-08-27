import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Interviewer } from '../model/interviewer.model';

@Injectable({
  providedIn: 'root',
})
export class InterviewerService {
  private apiUrl = `${environment.apiUrl}/interviewers`;

  constructor(private http: HttpClient) {}

  /**
   * Adds a new interviewer to the database.
   * @param interviewer The interviewer object to be created.
   * @returns An observable of the newly created Interviewer object.
   */
  addInterviewer(interviewer: Interviewer): Observable<Interviewer> {
    return this.http.post<Interviewer>(this.apiUrl, interviewer);
  }

  /**
   * Fetches all interviewers from the API.
   * @returns An observable of an array of Interviewer objects.
   */
  getAllInterviewers(): Observable<Interviewer[]> {
    return this.http.get<Interviewer[]>(this.apiUrl);
  }

  /**
   * Deletes an interviewer by their ID.
   * @param id The ID of the interviewer to delete.
   * @returns An observable of the response from the delete request.
   */
  deleteInterviewer(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  /**
   * @description
   * Assigns an interviewer to a specific interview process.
   * @param interviewerId The ID of the interviewer.
   * @param processId The ID of the process to assign the interviewer to.
   * @returns An observable of the API response.
   */
  assignInterviewerToProcess(
    interviewerId: number,
    processId: number
  ): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${interviewerId}/assign-process/${processId}`,
      {}
    );
  }

  /**
   * @description
   * Unassigns an interviewer from their current interview process.
   * @param interviewerId The ID of the interviewer to unassign.
   * @returns An observable of the API response.
   */
  unassignInterviewerFromProcess(interviewerId: number): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${interviewerId}/unassign-process`,
      {}
    );
  }
}
