import { Moment } from 'moment';
import { Subtask } from './SubTaskInterface';

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
    subtasks?: Subtask[];
}
