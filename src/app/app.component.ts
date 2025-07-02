import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
  <div class="flex flex-col items-center justify-center h-screen bg-gray-100">
    <h1 class="text-2xl font-bold">Task Management App</h1>
    <div class="flex flex-col items-center justify-center h-screen">
    <router-outlet></router-outlet>
  </div>
  </div>

  `,
})
export class AppComponent {
  title = 'signals-task-management-app';
}
