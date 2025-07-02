import { Injectable, signal } from '@angular/core';
import { Task } from './task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  // Private signal for encapsulation
  private _tasks = signal<Task[]>([{
    id: crypto.randomUUID(),
    title: 'Initial Task',
    completed: false
  }]);
  tasks = this._tasks.asReadonly();

  addTask(task: string) {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: task,
      completed: false,
    }

    this._tasks.update((tasks: Task[]) => [...tasks, newTask]); // Immutable update
  }

  toggleTask(id: string) {
    this._tasks.update((tasks: Task[]) => tasks.map(task => task.id === id ? {
      ...task,
      completed: !task.completed
    } : task))
  }

  deleteTask(id: string) {
    this._tasks.update((tasks: Task[]) => tasks.filter((t) => t.id === id));
  }
}
