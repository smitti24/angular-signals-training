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

export interface Command {
    execute(): void;
    undo(): void;
    description: string;
}
