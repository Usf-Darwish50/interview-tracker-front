import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { FeedbackDTO } from '../model/feedback.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FeebackService {
  private apiUrl = `${environment.apiUrl}/feedbacks`;

  constructor(private http: HttpClient) {}

  /**
   * Sends a POST request to submit new feedback.
   * @param feedbackData The data for the new feedback.
   * @returns An Observable of the API response.
   */
  submitFeedback(feedbackData: FeedbackDTO): Observable<any> {
    return this.http.post(this.apiUrl, feedbackData);
  }

  /**
   * Fetches all feedback for a specific candidate.
   * @param candidateId The ID of the candidate.
   * @returns An Observable of an array of feedback objects.
   */
  getFeedbackForCandidate(candidateId: number): Observable<any[]> {
    const url = `${this.apiUrl}/candidate/${candidateId}`;
    return this.http.get<any[]>(url);
  }
}
