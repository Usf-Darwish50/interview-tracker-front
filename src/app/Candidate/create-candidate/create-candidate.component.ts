import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-create-candidate',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-candidate.component.html',
  styleUrl: './create-candidate.component.css',
})
export class CreateCandidateComponent {
  candidateForm!: FormGroup;
  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.candidateForm = this.formBuilder.group({
      fullName: '',
      phone: '',
      address: '',
      email: '',
      resumeUrl: '',
      position: '',
    });
  }
}
