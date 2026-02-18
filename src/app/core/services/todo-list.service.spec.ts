import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TodoListService } from './todo-list.service';
import { environment } from '../../environments/environment';
import { Task } from '../../model/task';

describe('TodoListService', () => {
  let service: TodoListService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        TodoListService
      ]
    });
    service = TestBed.inject(TodoListService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a task', () => {
    const newTask = { title: 'Test Task', completed: false };
    const mockResponse: Task = { id: 1, ...newTask } as any;

    service.addList(newTask as any).subscribe(task => {
      expect(task).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}add-list`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newTask);
    req.flush(mockResponse);
  });

  it('should retrieve all tasks', () => {
    const mockTasks: Task[] = [
      { id: 1, title: 'Task 1', completed: false },
      { id: 2, title: 'Task 2', completed: true }
    ] as any[];

    service.getAllTasks().subscribe(tasks => {
      expect(tasks.length).toBe(2);
      expect(tasks).toEqual(mockTasks);
    });

    const req = httpMock.expectOne(`${apiUrl}list/all`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTasks);
  });

  it('should delete a task', () => {
    service.deleteTask(1).subscribe(res => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne(`${apiUrl}delete/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
