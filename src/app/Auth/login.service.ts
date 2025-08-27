import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Credentials, LoginResponse } from './login.model';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl = `${environment.apiUrl}/login`;

  constructor(private http: HttpClient) {}

  /**
   * @description
   * Sends a POST request to the login endpoint with user credentials.
   * @param credentials The user's username and password.
   * @returns An Observable of the API response, which typically includes
   * success status and a message or token.
   */
  login(credentials: Credentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl, credentials);
  }
}
