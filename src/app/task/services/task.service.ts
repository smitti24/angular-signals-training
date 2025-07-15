import { httpResource, HttpResourceRef } from '@angular/common/http';
import { computed, effect, inject, Injectable, ResourceStatus, signal, Signal } from '@angular/core';
import { Filter, Task } from '../models/task.model';
import { LocalStorage } from '../../shared/enums/localstorage.enum';
import { HistoryService } from './history.service';


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
    private readonly historyService = inject(HistoryService)

    private apiUrl = 'https://jsonplaceholder.typicode.com/todos'
    private _httpTasks?: HttpResourceRef<Task[] | undefined>

    private _tasks = signal<Task[]>([])
    tasks = this._tasks.asReadonly()

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
            const tasks = this._tasks()

            if (tasks.length > 0) {
                localStorage.setItem(LocalStorage.API_TASKS, JSON.stringify(tasks))
                console.log('[API] Tasks saved to Cache')
                this._isDirty.set(true)
            }
        })

        effect(() => {
            const isDirty = this._isDirty()

            if (isDirty) {
                localStorage.setItem(LocalStorage.IS_TASK_DIRTY, JSON.stringify(isDirty))
            }
        })
    }

    addTaskToApi(task: string) {
        const newTask: Task = {
            id: crypto.randomUUID(),
            title: task,
            completed: false
        }
        const updatedTasks = [newTask, ...this._tasks()]
        this._tasks.set(updatedTasks)
        this.historyService.saveSnapshot(updatedTasks)
    }

    filterTasks(filter: Filter) {
        this._filter.set(filter)
    }

    toggleTask(id: string) {
        const newTasks = this._tasks().map(task => task.id === id ? {
            ...task,
            completed: !task.completed
        } : task)
        this._tasks.set(newTasks)
        this.historyService.saveSnapshot(newTasks)
    }

    undo() {
        this.historyService.undo()
        const snapshot = this.historyService.snapshot
        if (snapshot) this._tasks.set(snapshot)
    }

    redo() {
        this.historyService.redo()
        const snapshot = this.historyService.snapshot
        if (snapshot) this._tasks.set(snapshot)
    }

    canUndo(): boolean {
        return this.historyService.canUndo()
    }

    canRedo(): boolean {
        return this.historyService.canRedo()
    }

    deleteTask(id: string) {
        const filteredTasks = this._tasks().filter(t => t.id !== id)
        this._tasks.set(filteredTasks)
        this.historyService.saveSnapshot(filteredTasks)
    }

    private initializeTasks(): void {
        const tasksCache = localStorage.getItem(LocalStorage.API_TASKS)
        if (!tasksCache) this.loadFromApi();
    }

    private loadFromApi(): void {
        this._httpTasks = httpResource<Task[]>(() => `${this.apiUrl}`)

        effect(() => {
            const apiTasks = this._httpTasks?.value()

            if (apiTasks) {
                this._tasks.set(apiTasks)
                console.log('[API] Tasks retrieved from API')
            }
        })
    }

    refreshTasks(): void {
        this._httpTasks?.reload();
    }

    private saveToServer(): void {
        this._isDirty.set(false)
    }
}