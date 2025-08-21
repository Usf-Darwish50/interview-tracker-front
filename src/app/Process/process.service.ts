import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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
}
