// src/types/task.ts
// import { Dayjs } from 'dayjs';
import { Moment } from 'moment';

export interface Task {
    id?: string;
    title: string;
    due_date: Moment | null | undefined;
    priority: string;
    status: string;
    description: string;
    user_id?: string;
    created_at?: Date;
    updated_at?: Date;
}