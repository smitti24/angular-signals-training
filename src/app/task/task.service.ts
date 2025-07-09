import { Injectable, signal, computed } from '@angular/core';
import { Filter, Task } from './task.model';

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

  private _filter = signal<Filter>(Filter.ALL)
  activeFilter = this._filter.asReadonly();

  completedTasksCount = computed(() => this._tasks().filter((t) => t.completed).length);
  pendingTasksCount = computed(() => this._tasks().length - this.completedTasksCount());
  filteredTasks = computed(() => {
    const tasks = this._tasks();

    switch (this._filter()) {
      case 'All': return tasks
      case 'Pending': return tasks.filter(t => !t.completed)
      case 'Completed': return tasks.filter(t => t.completed)
      default: return tasks
    }
  })

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

  toggleFilter(filter: Filter) {
    this._filter.set(filter);
  }

  deleteTask(id: string) {
    this._tasks.update((tasks: Task[]) => tasks.filter((t) => t.id !== id));
  }
}
