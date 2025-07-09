import { Component, input, output } from '@angular/core';
import { Task } from '../../task.model';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-task-list',
  imports: [NgClass],
  templateUrl: './task-list.component.html',
})
export class TaskListComponent {
  filteredTasks = input.required<Task[]>()
  toggleTask = output<string>()
  deleteTask = output<string>()


}
