import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TaskService } from './task.service';
import { TaskFilterButtonComponent } from './components/task-summary/task-filter-button.component';
import { TaskStatsComponent } from './components/task-stats/task-stats.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskInputComponent } from './components/task-input/task-input.component';
import { TaskApiService } from './task-api.service';

@Component({
  selector: 'app-task',
  imports: [TaskFilterButtonComponent, TaskStatsComponent, TaskListComponent, TaskInputComponent],
  templateUrl: './task.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskComponent {
  taskService = inject(TaskService)

  taskApiService = inject(TaskApiService)
}
