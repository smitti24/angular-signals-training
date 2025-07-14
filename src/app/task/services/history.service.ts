import { Injectable, signal } from '@angular/core';
import { Task } from '../models/task.model';
import { History } from '../models/history.model';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private history = signal<History<Task[]>>({
    past: [],
    present: [],
    future: []
  })

  get snapshot(): Task[][] {
    return this.history().present
  }
}
