import { Injectable, signal, computed, effect, untracked } from '@angular/core';
import { Filter, Task } from './task.model';
import { LocalStorage } from '../shared/enums/localstorage.enum';
import { toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';

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

  private _isDirty = signal<boolean>(false)
  isDirty = this._isDirty.asReadonly();

  constructor() {
    const tasksCache: string | null = localStorage.getItem(LocalStorage.TASKS)

    if (tasksCache) {
      try {
        const parsedTasks: Task[] = JSON.parse(tasksCache)
        this._tasks.set(parsedTasks)
      } catch (error) {
        console.error('Failed to parse tasks from localStorage:', error)
      }
    }

    const tasks$ = toObservable(this._tasks).pipe(
      debounceTime(1000),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
    );

    effect((onCleanup) => {
      const sub = tasks$.subscribe(tasks => {
        localStorage.setItem(LocalStorage.TASKS, JSON.stringify(tasks));
      });
      onCleanup(() => sub.unsubscribe());
    })

    effect(() => {
      const tasks = this._tasks()
      console.log('[UPDATE] Total Tasks', tasks);
    })

    effect((onCleanup) => {
      const tasks = this._tasks();

      if (tasks.length > 0) {
        const lastTask = tasks[tasks.length - 1]
        console.log(`[ADD] Task ${lastTask.title}`)
      }
    })

    effect(() => {
      this.tasks()
      this._isDirty.set(true)
    })
  }



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

  private saveToServer(): void {
    this._isDirty.set(false)
  }
}
