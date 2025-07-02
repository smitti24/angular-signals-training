import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./task/task.component').then(m => m.TaskComponent),
    },
];
