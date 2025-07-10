import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { computed, effect, inject, Injectable, ResourceStatus, signal, Signal, WritableSignal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Task } from './task.model';
import { LocalStorage } from '../shared/enums/localstorage.enum';
import { resourceLimits } from 'worker_threads';

// httpResource returns multiple signals
interface ResourceRef<T> {
    value(): Signal<T | undefined>      // The actual data
    isLoading(): Signal<boolean>        // Loading state
    error(): Signal<any>               // Error state  
    status(): Signal<ResourceStatus>   // Overall status
    reload(): void                     // Method to refetch
}


@Injectable({ providedIn: 'root' })
export class TaskApiService {
    private apiUrl = 'https://jsonplaceholder.typicode.com/todos'
    private _httpTasks?: HttpResourceRef<Task[] | undefined>

    private _tasks = signal<Task[]>([])
    tasks = this._tasks.asReadonly()

    isLoading = computed(() => {
        return this._httpTasks?.isLoading() ?? false
    })

    error = computed(() => {
        return this._httpTasks?.error() ?? null
    })

    addTaskToApi(task: string) {
        const newTask: Task = {
            id: crypto.randomUUID(),
            title: task,
            completed: false
        }
        this._tasks.update((tasks) => [...tasks!, newTask])
    }

    constructor() {
        this.initializeTasks()
    }

    private initializeTasks(): void {
        const tasksCache = localStorage.getItem(LocalStorage.API_TASKS)

        if (tasksCache) {
            this._tasks.set(JSON.parse(tasksCache))
            console.log('[CACHE] Tasks retrieved from Cache')
        } else {
            // get fresh data from the api
            this.loadFromApi();
        }

        // If the tasks signal changes, add it to local storage
        effect(() => {
            const tasks = this._tasks()

            if (tasks) {
                localStorage.setItem(LocalStorage.API_TASKS, JSON.stringify(tasks))
            }
        })
    }

    private loadFromApi(): void {
        this._httpTasks = httpResource<Task[]>({
            url: this.apiUrl,
        })

        effect(() => {
            const apiTasks = this._httpTasks?.value()

            if (apiTasks) {
                this._tasks.set(apiTasks)
                console.log('[API] Tasks retrieved from API')
            }

        })
    }
}