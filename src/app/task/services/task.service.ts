import { httpResource, HttpResourceRef } from '@angular/common/http';
import { computed, effect, Injectable, ResourceStatus, signal, Signal } from '@angular/core';
import { Command, Filter, Task } from '../models/task.model';
import { LocalStorage } from '../../shared/enums/localstorage.enum';
import { debounceTime } from 'rxjs/operators';
import { toObservable } from '@angular/core/rxjs-interop';

// httpResource returns multiple signals
interface ResourceRef<T> {
    value(): Signal<T | undefined>      // The actual data
    isLoading(): Signal<boolean>        // Loading state
    error(): Signal<any>               // Error state  
    status(): Signal<ResourceStatus>   // Overall status
    reload(): void                     // Method to refetch
}

@Injectable({ providedIn: 'root' })
export class TaskService {
    private apiUrl = 'https://jsonplaceholder.typicode.com/todos'
    private _httpTasks?: HttpResourceRef<Task[] | undefined>

    private _tasks = signal<Task[]>([])
    tasks = this._tasks.asReadonly()

    // Move toObservable to field initializer
    private tasks$ = toObservable(this._tasks) // ✅ This works in injection context

    private _history = signal<{ past: Command[], future: Command[] }>({ past: [], future: [] });
    history = this._history.asReadonly();
    historyLog = computed(() => this._history().past.map(c => c.description));

    private _isDirty = signal<boolean>(false)
    isDirty = this._isDirty.asReadonly()

    private _filter = signal<Filter>(Filter.ALL)
    activeFilter = this._filter.asReadonly()

    isLoading = computed(() => {
        return this._httpTasks?.isLoading() ?? false
    })

    error = computed(() => {
        return this._httpTasks?.error() ?? null
    })

    filteredTasks = computed(() => {
        const tasks = this._tasks()

        switch (this._filter()) {
            case Filter.ALL: return tasks
            case Filter.PENDING: return tasks.filter(task => !task.completed)
            case Filter.COMPLETED: return tasks.filter(task => task.completed)
            default: return tasks
        }
    })

    completedTasks = computed(() => this.tasks().filter((task) => task.completed).length)
    pendingTasks = computed(() => this._tasks().length - this.completedTasks());
    totalTasks = computed(() => this.pendingTasks() + this.completedTasks())

    constructor() {
        this.initializeTasks()

        effect(() => {
            // Use the pre-created observable instead
            this.tasks$
                .pipe(debounceTime(500))
                .subscribe(tasks => {
                    if (tasks.length > 0) {
                        localStorage.setItem(LocalStorage.API_TASKS, JSON.stringify(tasks));
                        console.log('[API] Tasks saved to Cache');
                        this._isDirty.set(true);
                    }
                });
        })

        effect(() => {
            const isDirty = this._isDirty()

            if (isDirty) {
                localStorage.setItem(LocalStorage.IS_TASK_DIRTY, JSON.stringify(isDirty))
            }
        })

        effect(() => {
            const apiTasks = this._httpTasks?.value();
            if (apiTasks) {
                const command: Command = {
                    execute: () => this._tasks.set(apiTasks),
                    undo: () => this._tasks.set([]),
                    description: 'Loaded tasks from API'
                };
                command.execute();
                this._history.update(h => ({ past: [...h.past, command], future: [] }));
                console.log('[API] Tasks retrieved from API');
            }
        });
    }

    addTaskToApi(task: string) {
        const newTask: Task = {
            id: crypto.randomUUID(),
            title: task,
            completed: false
        };
        const command: Command = {
            execute: () => this._tasks.update(tasks => [newTask, ...tasks]),
            undo: () => this._tasks.update(tasks => tasks.filter(t => t.id !== newTask.id)),
            description: `Added task: ${task}`
        };
        command.execute();
        this._history.update(h => ({ past: [...h.past, command], future: [] }));
    }

    filterTasks(filter: Filter) {
        this._filter.set(filter)
    }

    toggleTask(id: string) {
        const task = this._tasks().find(t => t.id === id);
        if (!task) return;
        const command: Command = {
            execute: () =>
                this._tasks.update(tasks =>
                    tasks.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
                ),
            undo: () =>
                this._tasks.update(tasks =>
                    tasks.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
                ),
            description: `Toggled task: ${task.title}`
        };
        command.execute();
        this._history.update(h => ({ past: [...h.past, command], future: [] }));
    }

    undo() {
        const { past, future } = this._history();
        if (past.length === 0) return;
        const lastCommand = past[past.length - 1];
        lastCommand.undo();
        this._history.set({ past: past.slice(0, -1), future: [lastCommand, ...future] });
    }

    redo() {
        const { past, future } = this._history();
        if (future.length === 0) return;
        const nextCommand = future[0];
        nextCommand.execute();
        this._history.set({ past: [...past, nextCommand], future: future.slice(1) });
    }

    canUndo(): boolean {
        return this._history().past.length > 0;
    }

    canRedo(): boolean {
        return this._history().future.length > 0;
    }

    deleteTask(id: string) {
        const task = this._tasks().find(t => t.id === id);
        if (!task) return;
        const command: Command = {
            execute: () => this._tasks.update(tasks => tasks.filter(t => t.id !== id)),
            undo: () => this._tasks.update(tasks => [...tasks, task]),
            description: `Deleted task: ${task.title}`
        };
        command.execute();
        this._history.update(h => ({ past: [...h.past, command], future: [] }));
    }

    private initializeTasks(): void {
        // Always initialize the HTTP resource first
        this.loadFromApi();

        const tasksCache = localStorage.getItem(LocalStorage.API_TASKS);
        if (tasksCache) {
            try {
                const tasks = JSON.parse(tasksCache) as Task[];
                const command: Command = {
                    execute: () => this._tasks.set(tasks),
                    undo: () => this._tasks.set([]),
                    description: 'Loaded tasks from cache'
                };
                command.execute();
                this._history.update(h => ({ past: [...h.past, command], future: [] }));
                console.log('[Cache] Tasks loaded from cache');
            } catch (error) {
                console.error('Failed to parse tasks from localStorage:', error);
                // HTTP resource already initialized, effect will handle API data
            }
        }
        // If no cache, the effect will handle loading from API
    }

    private loadFromApi(): void {
        this._httpTasks = httpResource<Task[]>(() => `${this.apiUrl}`);
    }

    refreshTasks(): void {
        this._httpTasks?.reload();
    }

    private saveToServer(): void {
        this._isDirty.set(false);
    }
}