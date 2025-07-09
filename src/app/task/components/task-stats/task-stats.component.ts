import { Component, input } from '@angular/core';

@Component({
  selector: 'app-task-stats',
  imports: [],
  templateUrl: './task-stats.component.html',
})
export class TaskStatsComponent {
  pendingTasksCount = input.required<number>()
  completedTasksCount = input.required<number>()
}
