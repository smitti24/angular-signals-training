import { Component, inject } from '@angular/core';
import { TaskService } from './task.service';

@Component({
  selector: 'app-task',
  imports: [],
  templateUrl: './task.component.html',
})
export class TaskComponent {
  readonly taskService = inject(TaskService)

}
