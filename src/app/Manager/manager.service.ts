import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { NewManager } from './manager.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ManagerService {
  private apiUrl = `${environment.apiUrl}/managers`;

  constructor(private http: HttpClient) {}

  /**
   * Sends a POST request to create a new manager.
   * @param managerData The data for the new manager.
   * @returns An Observable of the API response.
   */
  createManager(managerData: NewManager): Observable<any> {
    return this.http.post(this.apiUrl, managerData);
  }
}
