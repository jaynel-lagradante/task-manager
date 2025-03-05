import React, { useState, useEffect } from 'react';
import {
    Typography, Box, Select, MenuItem, FormControl, InputLabel, Paper,
    IconButton,
    Checkbox,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import EditIcon from './../assets/Icons/Edit.svg';
import { useNavigate } from 'react-router-dom';
import { DeleteTask, GetTasks } from '../services/TaskService';
import DashboardComponent from './DashboardComponent';
import NotStartedIcon from './../assets/Icons/Not Started.svg';
import InProgressIcon from './../assets/Icons/In Progress.svg';
import CompleteIcon from './../assets/Icons/Complete.svg';
import CancelledIcon from './../assets/Icons/Cancelled.svg';
import NewTaskButtonIcon from './../assets/Buttons/Button_New Task.svg';
import DeleteActiveIcon from './../assets/Icons/Delete_active.svg';
import { CuztomizedHeaderBox, DeleteButtonBadge } from '../layouts/DashboardStyles';
import DeleteInactiveIcon from './../assets/Icons/Delete_inactive.svg';
import { Task } from '../types/TaskInterface';
import DeleteConfirmationModal from './DeleteConfirmationModalComponent';

const TaskListComponent: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const navigate = useNavigate();
    const [priorityFilter, setPriorityFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedRows, setSelectedRows] = useState<string[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false);

    const isAuthenticated = !!localStorage.getItem('token');

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login'); 
            return;
        }

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
    }, [navigate, isAuthenticated]);

    const handleEdit = (taskId: string) => {
        navigate(`/edit-task/${taskId}`);
    };

    const filteredTasks = tasks.filter((task) => {
        const priorityMatch = priorityFilter === 'All' || task.priority === priorityFilter;
        const statusMatch = statusFilter === 'All' || task.status === statusFilter;
        return priorityMatch && statusMatch;
    });

    const handleDeleteSelected = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleConfirmDelete = async () => {
        try {
            for (const taskId of selectedRows) {
                await DeleteTask(taskId);
            }
            const updatedTasks = tasks.filter((task) => {
                if (task.id) {
                    return !selectedRows.includes(task.id);
                }
                return true;
            });
            setTasks(updatedTasks);
            setSelectedRows([]);
            setIsModalOpen(false); // Close modal after delete
        } catch (error) {
            console.error('Error deleting selected tasks:', error);
        }
    };

    const columns: GridColDef[] = [
        {
            field: 'selection',
            width: 75,
            sortable: false,
            renderHeader: () => (
                selectedRows.length > 0 ? (
                    <CuztomizedHeaderBox>
                        <DeleteButtonBadge badgeContent={selectedRows.length} color="primary">
                            <IconButton onClick={handleDeleteSelected}>
                                <img src={DeleteActiveIcon} alt="Delete" style={{ height: '20px' }} />
                            </IconButton>
                        </DeleteButtonBadge>
                    </CuztomizedHeaderBox>
                ) : (
                    <Box>
                        <IconButton disabled>
                            <img src={DeleteInactiveIcon} alt="Delete" style={{ height: '20px' }} />
                        </IconButton>
                    </Box>
                )
            ),
            renderCell: (params) => (
                <Checkbox 
                    checked={selectedRows.includes(params.row.id)}
                    onChange={(e) => {
                        if (e.target.checked) {
                            setSelectedRows([...selectedRows, params.row.id]);
                        } else {
                            setSelectedRows(selectedRows.filter((id) => id !== params.row.id));
                        }
                    }}
                />
            ),
            headerAlign: 'center',
            align: 'center',
            filterable: false,
            disableColumnMenu: true,
        },
        { field: 'title', headerName: 'Title', flex: 1},
        { field: 'due_date', headerName: 'Due Date', flex: 1 },
        { field: 'priority', headerName: 'Priority', flex: 1 },
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
            width: 50,
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

    if (!isAuthenticated) {
        return null;
    }

    return (
        <DashboardComponent>
            <Paper sx={{ padding: '16px', backgroundColor: '#F2F8FD' }}>
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
                    <IconButton onClick={() => navigate('/create-task')}>
                        <img src={NewTaskButtonIcon} alt="New Task" style={{ height: '40px' }} />
                    </IconButton>
                </Box>
                <div style={{ height: '100%', width: '100%', marginTop: '20px' }}>
                    <DataGrid
                        rows={filteredTasks}
                        columns={columns}
                        getRowId={(row) => row.id}
                        // pagination={false} // Disable pagination
                        hideFooterSelectedRowCount // Hide "row selected" label
                        hideFooterPagination // Hide pagination controls
                        // checkboxSelection
                        // disableSelectionOnClick
                    />
                </div>
            </Paper>

            <DeleteConfirmationModal
                open={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmDelete}
                count={selectedRows.length}
            />
        </DashboardComponent>
    );
};

export default TaskListComponent;