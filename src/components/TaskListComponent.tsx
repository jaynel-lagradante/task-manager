import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Button, Box, Select, MenuItem, FormControl, InputLabel,
    Paper,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid'; // Import DataGrid
import EditIcon from './../assets/Icons/Edit.svg';
import { useNavigate } from 'react-router-dom';
import { DeleteTask, GetTasks } from '../services/TaskService';
import DashboardComponent from './DashboardComponent';
import NotStartedIcon from './../assets/Icons/Not Started.svg';
import InProgressIcon from './../assets/Icons/In Progress.svg';
import CompleteIcon from './../assets/Icons/Complete.svg';
import CancelledIcon from './../assets/Icons/Cancelled.svg';

interface Task {
    id: string;
    title: string;
    due_date: string;
    priority: string;
    status: string;
    user_id: string;
    description: string;
    attachments: Buffer | null;
    created_at: Date;
    updated_at: Date;
    date_completed: Date;
}

const TaskListComponent: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const navigate = useNavigate();
    const [priorityFilter, setPriorityFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const fetchedTasks = await GetTasks();
                setTasks(fetchedTasks);
            } catch (error) {
                console.error('Error fetching tasks:', error);
                navigate('/login');
            }
        };
        fetchTasks();
    }, [navigate]);

    const handleDelete = async (taskId: string) => {
        try {
            await DeleteTask(taskId);
            const updatedTasks = tasks.filter((task) => task.id !== taskId);
            setTasks(updatedTasks);
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const handleEdit = (taskId: string) => {
        navigate(`/edit-task/${taskId}`);
    };

    const filteredTasks = tasks.filter((task) => {
        const priorityMatch = priorityFilter === 'All' || task.priority === priorityFilter;
        const statusMatch = statusFilter === 'All' || task.status === statusFilter;
        return priorityMatch && statusMatch;
    });

    const columns: GridColDef[] = [
        { field: 'title', headerName: 'Title', flex: 1},
        { field: 'due_date', headerName: 'Due Date', flex: 1 },
        { field: 'priority', headerName: 'Priority', flex: 1 },
        // { field: 'status', headerName: 'Status', flex: 1 },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            renderCell: (params) => {
                let icon;
                switch (params.value) {
                    case 'Not Started':
                        icon = NotStartedIcon;
                        break;
                    case 'In Progress':
                        icon = InProgressIcon;
                        break;
                    case 'Complete':
                        icon = CompleteIcon;
                        break;
                    case 'Cancelled':
                        icon = CancelledIcon;
                        break;
                    default:
                        icon = null;
                }
                return (
                    <Box display="flex" alignItems="center">
                        {icon && <img src={icon} alt={params.value} style={{ height: '20px', marginRight: '8px' }} />}
                        <span>{params.value}</span>
                    </Box>
                );
            },
        },
        {
            field: 'actions',
            headerName: '',
            width: 100,
            sortable: false,
            renderCell: (params) => (
                <img
                    src={EditIcon}
                    alt="Edit"
                    style={{ height: '20px', cursor: 'pointer' }}
                    onClick={() => handleEdit(params.row.id)}
                />
            ),
        },
    ];

    return (
        <DashboardComponent>
            <Paper sx={{ padding: '16px', backgroundColor: '#f0f0f0' }}>
                <Typography variant="h4" gutterBottom>
                    To-do
                </Typography>
                <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" gap={2}>
                        <FormControl>
                            <InputLabel>Priority</InputLabel>
                            <Select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
                                <MenuItem value="All">All</MenuItem>
                                <MenuItem value="Low">Low</MenuItem>
                                <MenuItem value="High">High</MenuItem>
                                <MenuItem value="Critical">Critical</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl>
                            <InputLabel>Status</InputLabel>
                            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                                <MenuItem value="All">All</MenuItem>
                                <MenuItem value="Not Started">Not Started</MenuItem>
                                <MenuItem value="In Progress">In Progress</MenuItem>
                                <MenuItem value="Complete">Complete</MenuItem>
                                <MenuItem value="Cancelled">Cancelled</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Button variant="outlined" color="primary" onClick={() => navigate('/create-task')}>
                        New Task
                    </Button>
                </Box>
                <div style={{ height: 400, width: '100%', marginTop: '20px' }}>
                    <DataGrid
                        rows={filteredTasks}
                        columns={columns}
                        getRowId={(row) => row.id}
                        checkboxSelection
                        // disableSelectionOnClick
                    />
                </div>
            </Paper>
        </DashboardComponent>
    );
};

export default TaskListComponent;