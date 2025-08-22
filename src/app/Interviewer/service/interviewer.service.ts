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
   * Fetches all interviewers from the API.
   * @returns An observable of an array of Interviewer objects.
   */
  getAllInterviewers(): Observable<Interviewer[]> {
    return this.http.get<Interviewer[]>(this.apiUrl);
  }
}
