export interface Task {
    id: string;
    title: string;
    completed: boolean;
}

export enum Filter {
    'ALL' = 'All',
    'PENDING' = 'Pending',
    'COMPLETED' = 'Completed'
}
