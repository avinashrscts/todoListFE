import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateComponent } from '../create/create.component';
import { TakslistComponent } from '../taskList/takslist.component';
import { Task } from '../../model/task';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule, CreateComponent, TakslistComponent, MatCardModule],
  templateUrl: './task.component.html',
    styleUrls: ['./task.component.scss']
})
export class TaskComponent {
  @ViewChild(TakslistComponent) taskListComponent!: TakslistComponent;
  @ViewChild(CreateComponent) createComponent!: CreateComponent;

  onTaskCreated(): void {
    this.taskListComponent.refreshTasks();
  }

  onTaskUpdated(): void {
    this.taskListComponent.refreshTasks();
  }

  onTaskDeleted(): void {
    this.taskListComponent.refreshTasks();
  }

  onEditRequest(task: Task): void {
    this.createComponent.loadTask(task);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
