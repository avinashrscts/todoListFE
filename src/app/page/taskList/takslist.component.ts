import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Task } from '../../model/task';
import { TodoListService } from '../../core/services/todo-list.service';

@Component({
  selector: 'app-takslist',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './takslist.component.html',
  styleUrls: ['./takslist.component.scss']
})
export class TakslistComponent implements OnInit {
  tasks: Task[] = [];
  displayedColumns: string[] = ['name', 'description', 'startDate', 'endDate', 'status', 'effort', 'actions'];

  @Output() editRequest = new EventEmitter<Task>();
  @Output() taskDeleted = new EventEmitter<void>();

  constructor(private todoListService: TodoListService) {}

  ngOnInit(): void {
    this.refreshTasks();
  }

  refreshTasks(): void {
    this.todoListService.getAllTasks().subscribe(data => {
      this.tasks = data;
    });
  }

  onEdit(task: Task): void {
    this.editRequest.emit(task);
  }

  onDelete(id: number): void {
    this.todoListService.deleteTask(id).subscribe(() => {
      this.taskDeleted.emit();
      this.refreshTasks();
    });
  }
}
