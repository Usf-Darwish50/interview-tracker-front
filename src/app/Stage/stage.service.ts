import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Stage } from './model/stage.model';

@Injectable({
  providedIn: 'root',
})
export class StageService {
  private apiUrl = `${environment.apiUrl}/processes`;

  constructor(private http: HttpClient) {}

  /**
   * Creates a new stage for a given process.
   * @param processId The ID of the hiring process.
   * @param title The title of the new stage.
   * @param description The description of the new stage.
   * @returns An observable of the API response.
   */
  addStage(
    processId: number,
    title: string,
    description: string
  ): Observable<any> {
    const stageData = {
      stageId: 0, // Backend will generate this
      title: title,
      description: description,
      stageOrder: 0, // Backend should determine the order
      status: 'NOT_STARTED',
      hiringProcess: { processId: processId }, // Link to the parent process
      assignedInterviewers: [],
      deleted: false,
    };

    return this.http.post(`${this.apiUrl}/${processId}/stages`, stageData);
  }

  /**
   * Fetches all stages for a given process.
   * @param processId The ID of the hiring process.
   * @returns An observable of the array of stages.
   */
  getStagesByProcessId(processId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${processId}/stages`);
  }

  /**
   * Updates an existing stage's details, including its status.
   * @param processId The ID of the hiring process.
   * @param stage The updated stage object.
   * @returns An observable of the API response.
   */
  updateStage(processId: number, stage: Stage): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${processId}/stages/${stage.stageId}`,
      stage
    );
  }

  /**
   * Assigns interviewers to a specific stage.
   * @param processId The ID of the hiring process.
   * @param stageId The ID of the stage.
   * @param interviewerIds An array of interviewer IDs.
   * @returns An observable of the API response.
   */
  assignInterviewersToStage(
    processId: number,
    stageId: number,
    interviewerIds: number[]
  ): Observable<any> {
    const body = {
      interviewerIds: interviewerIds,
    };
    return this.http.put(
      `${this.apiUrl}/${processId}/stages/${stageId}/assign-interviewers`,
      body
    );
  }
}
