import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TaskService } from './task.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-task',
  imports: [NgClass],
  templateUrl: './task.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskComponent {
  taskService = inject(TaskService)
}
