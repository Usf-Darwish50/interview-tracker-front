import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { StageService } from '../stage.service';

@Component({
  selector: 'app-add-stage',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-stage.component.html',
  styleUrl: './add-stage.component.css',
})
export class AddStageComponent {
  @Input() processId!: number;
  @Output() stageCreated = new EventEmitter<any>();
  @Output() closeDialog = new EventEmitter<void>();

  addStageForm!: FormGroup;
  isSubmitting = false;
  showSuccessMessage = false;
  constructor(
    private formBuilder: FormBuilder,
    private stageService: StageService
  ) {}

  ngOnInit(): void {
    this.addStageForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: [''],
    });
  }

  onSubmit() {
    if (this.addStageForm.invalid) {
      this.addStageForm.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;

    const { title, description } = this.addStageForm.value;

    this.stageService.addStage(this.processId, title, description).subscribe({
      next: (response) => {
        console.log('Stage created successfully:', response);
        this.showSuccessMessage = true;
        this.isSubmitting = false;
        setTimeout(() => {
          this.closeDialog.emit();
          this.stageCreated.emit(response);
        }, 2000);
      },
      error: (error) => {
        console.error('Error creating stage:', error);
        this.isSubmitting = false;
      },
    });
  }
}
