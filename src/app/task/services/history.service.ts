import { Injectable, signal } from '@angular/core'
import { Task } from '../models/task.model'
import { History } from '../models/history.model'

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private _history = signal<History<Task[]>>({
    past: [],
    present: [],
    future: []
  })
  readonly history = this._history.asReadonly()

  get snapshot(): Task[] {
    return this._history().present
  }

  saveSnapshot(newPresent: Task[]): void {
    const { past, present } = this._history()
    this._history.set({
      past: [...past, present],
      present: newPresent,
      future: []
    })
  }

  undo(): void {
    const { past, present, future } = this._history()
    if (!past.length) return

    const previous = past[past.length - 1]
    this._history.set({
      past: past.slice(0, -1),
      present: previous,
      future: [present, ...future]
    })
  }

  redo(): void {
    const { past, present, future } = this._history()
    if (!future.length) return

    const next = future[0]
    this._history.set({
      past: [...past, present],
      present: next,
      future: future.slice(1)
    })
  }

  canUndo(): boolean {
    return this._history().past.length > 0
  }

  canRedo(): boolean {
    return this._history().future.length > 0
  }
}
