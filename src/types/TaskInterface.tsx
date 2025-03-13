import { Moment } from 'moment';
import { Subtask } from './SubTaskInterface';

export interface Task {
    id?: string;
    title: string;
    due_date: Moment | null;
    priority: string;
    status: string;
    description: string;
    user_id?: string;
    date_completed?: Moment | null;
    created_at?: Date;
    updated_at?: Date;
    subtasks?: Subtask[];
}
