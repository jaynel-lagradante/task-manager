import { create } from 'zustand';
import { Task } from '../types/TaskInterface';
import { GetTasks } from '../services/TaskService';

interface TaskListState {
    tasks: Task[];
    fetchTasks: () => Promise<void>;
    setTasks: (newTasks: Task[]) => void;
    addTask: (newTask: Task) => void;
    updateTaskInState: (updatedTask: Task) => void;
    deleteTaskFromState: (taskId: string) => void;
}

export const useTaskState = create<TaskListState>((set, get) => ({
    tasks: [],
    fetchTasks: async () => {
        try {
            const fetchedTasks = await GetTasks();
            set({ tasks: fetchedTasks });
        } catch (error) {
            console.error('Error fetching tasks in store:', error);
        }
    },
    setTasks: (newTasks) => set({ tasks: newTasks }),
    addTask: (newTask) => {
        set((state) => ({ tasks: [...state.tasks, newTask] }));
    },
    updateTaskInState: (updatedTask) => {
        set((state) => ({
            tasks: state.tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
        }));
    },
    deleteTaskFromState: (taskId) => {
        set((state) => ({
            tasks: state.tasks.filter((task) => task.id !== taskId),
        }));
    },
}));

export const selectTasks = (state: TaskListState) => state.tasks;
