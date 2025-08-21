import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AddProcessComponent } from '../Process/add-process/add-process.component';
import { Observable } from 'rxjs';
import { HiringProcessProfile } from '../Process/model/process.model';
import { ProcessService } from '../Process/process.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, AddProcessComponent, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  processDistribution = {
    completed: 45,
    inProgress: 35,
    cancelled: 20,
  };

  activeProcesses$!: Observable<HiringProcessProfile[]>;

  showAddProcessDialog = false;
  managerId = 3;

  constructor(private processService: ProcessService) {}

  ngOnInit(): void {
    this.activeProcesses$ = this.processService.getAllProcesses();
  }

  onAddProcessClick() {
    this.showAddProcessDialog = true;
  }

  onProcessCreated() {
    console.log('Process created. Refreshing dashboard data...');
    this.activeProcesses$ = this.processService.getAllProcesses();
    this.showAddProcessDialog = false;
  }
}
