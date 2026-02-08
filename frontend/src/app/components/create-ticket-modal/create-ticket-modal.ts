import { Component, output, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CreateTicketDto } from '../../models/ticket.model';

@Component({
  selector: 'app-create-ticket-modal',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-ticket-modal.html',
  styles: [`
    :host {
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 50;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateTicketModal {
  private fb = inject(FormBuilder);
  onClose = output<void>();
  onSubmit = output<CreateTicketDto>();

  ticketForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required]],
    type: ['feature' as const, Validators.required],
    priority: ['medium' as const, Validators.required],
    complexity: [1, [Validators.min(1), Validators.max(13)]],
    estimatedHours: [1, [Validators.min(0)]]
  });

  submit() {
    if (this.ticketForm.valid) {
      const formValue = this.ticketForm.getRawValue();
      const dto: CreateTicketDto = {
        projectId: 0, 
        title: formValue.title,
        description: formValue.description,
        type: formValue.type as any,
        priority: formValue.priority as any,
        complexity: formValue.complexity,
        estimatedHours: formValue.estimatedHours
      };
      this.onSubmit.emit(dto);
    }
  }

  close() {
    this.onClose.emit();
  }
}
