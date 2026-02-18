import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { TodoListService } from '../../core/services/todo-list.service';
import { CommonModule } from '@angular/common';
import { Task } from '../../model/task';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatSelectModule
  ],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  taskForm!: FormGroup;
  editingTask: Task | null = null;
  @Output() taskCreated = new EventEmitter<void>();
  @Output() taskUpdated = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private todoListService: TodoListService
  ) { }

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      totalEffortRequired: [0, [Validators.required, Validators.min(1)]],
      status: ['pending', Validators.required]
    }, { validators: dateRangeValidator });
  }

  public loadTask(task: Task): void {
    this.editingTask = task;
    const formatDate = (date: Date | string) => new Date(date).toISOString().split('T')[0];
    this.taskForm.patchValue({
      ...task,
      startDate: formatDate(task.startDate),
      endDate: formatDate(task.endDate),
    });
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      return;
    }

    if (this.editingTask) {
      const updatedTask = { ...this.editingTask, ...this.taskForm.value };
      this.todoListService.updateTask(updatedTask).subscribe(() => {
        this.taskUpdated.emit();
        this.cancelEdit();
      });
    } else {
      this.todoListService.addList(this.taskForm.value).subscribe(() => {
        this.taskCreated.emit();
        this.cancelEdit();
      });
    }
  }

  cancelEdit(): void {
    this.editingTask = null;
    this.taskForm.reset({ status: 'pending', totalEffortRequired: 0 });
  }
}

export const dateRangeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const startDate = control.get('startDate')?.value;
  const endDate = control.get('endDate')?.value;

  if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
    return { dateRangeInvalid: true };
  }
  return null;
};
