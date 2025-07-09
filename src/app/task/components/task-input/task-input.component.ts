import { Component, output } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms'

@Component({
  selector: 'app-task-input',
  imports: [ReactiveFormsModule],
  templateUrl: './task-input.component.html',
})
export class TaskInputComponent {
  addTask = output<string>()

  taskControl = new FormControl('', [
    Validators.required,
    Validators.minLength(1)
  ])


  onKeyUp(event: KeyboardEvent): void {
    if (event.key === 'Enter') this.onAddTask()
  }

  private onAddTask() {
    if (this.taskControl.valid && this.taskControl.value?.trim()) {
      this.addTask.emit(this.taskControl.value)
      this.taskControl.reset()
    }
  }
}
