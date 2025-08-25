import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProcessService } from '../process.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-add-process',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-process.component.html',
  styleUrl: './add-process.component.css',
})
export class AddProcessComponent {
  @Input() managerId!: number;
  @Output() processCreated = new EventEmitter<void>();
  @Output() closeDialog = new EventEmitter<void>();

  processForm!: FormGroup;
  isSubmitting = false;
  showSuccessMessage = false;

  constructor(
    private formBuilder: FormBuilder,
    private processService: ProcessService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.processForm = this.formBuilder.group({
      title: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.processForm.invalid) {
      this.processForm.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;

    const payLoad = {
      title: this.processForm.value.title,
      status: 'NOT_STARTED',
      createdDate: new Date().toISOString(),

      managerId: this.managerId,
      deleted: false,
    };

    this.processService.createProcess(payLoad).subscribe({
      next: (response) => {
        console.log('Process created successfully:', response);
        this.showSuccessMessage = true;
        this.isSubmitting = false;
        setTimeout(() => {
          this.closeDialog.emit();
          this.router.navigate(['/process-profile', response.processId]);
          this.processCreated.emit();
        }, 2000);
      },
      error: (error) => {
        console.error('Error creating process:', error);
        this.isSubmitting = false;
      },
    });
  }
}
