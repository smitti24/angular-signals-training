import { Injectable, signal } from '@angular/core'
import { Task } from '../models/task.model'
import { History } from '../models/history.model'

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private history = signal<History<Task[]>>({
    past: [],
    present: [],
    future: []
  })

  get snapshot(): Task[] {
    return this.history().present
  }

  saveSnapshot(newPresent: Task[]): void {
    const { past, present } = this.history()
    this.history.set({
      past: [...past, present],
      present: newPresent,
      future: []
    })
  }

  undo(): void {
    const { past, present, future } = this.history()
    if (!past.length) return

    const previous = past[past.length - 1]
    this.history.set({
      past: past.slice(0, -1),
      present: previous,
      future: [present, ...future]
    })
  }

  redo(): void {
    const { past, present, future } = this.history()
    if (!future.length) return

    const next = future[0]
    this.history.set({
      past: [...past, present],
      present: next,
      future: future.slice(1)
    })
  }

  canUndo(): boolean {
    return this.history().past.length > 0
  }

  canRedo(): boolean {
    return this.history().future.length > 0
  }
}
