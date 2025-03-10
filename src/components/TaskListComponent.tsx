import React, { useState, useEffect } from 'react';
import {
    Typography, Box,
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
import FilterComponent from './FilterComponent';
import ChipCancelled from '../assets/Chips/Chip_Cancelled.svg';
import ChipComplete from '../assets/Chips/Chip_Complete.svg';
import ChipInProgress from '../assets/Chips/Chip_In progress.svg';
import ChipNotStarted from '../assets/Chips/Chip_Not started.svg';
import ChipLow from '../assets/Chips/Chip_Low.svg';
import ChipHigh from '../assets/Chips/Chip_High.svg';
import ChipCritical from '../assets/Chips/Chip_Critical.svg';
import { FilterContainerBox, FilterIconImg, TableContainer } from '../layouts/TaskListStyles';

const TaskListComponent: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const navigate = useNavigate();
    const [selectedRows, setSelectedRows] = useState<string[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
    const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);

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
        let priorityMatch = true;
        let statusMatch = true;

        if (selectedPriorities.length > 0) {
            priorityMatch = selectedPriorities.includes(task.priority);
        }

        if (selectedStatuses.length > 0) {
            statusMatch = selectedStatuses.includes(task.status);
        } 

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

    const menuItems = [
        {
          label: 'Priority',
          subMenu: [
            { label: 'All' },
            { label: 'Low' },
            { label: 'High' },
            { label: 'Critical' },
          ],
        },
        {
          label: 'Status',
          subMenu: [
            { label: 'All'},
            { label: 'Not Started' },
            { label: 'In Progress'},
            { label: 'Complete'},
            { label: 'Cancelled'},
          ],
        },
      ];

    const handleFilter = (mainMenu: string | null, subMenu: string | null) => {
        if (mainMenu === 'Priority' && subMenu) {
            if (subMenu === 'All') {
                setSelectedPriorities([]);
                return;
            }
            const priority = [...selectedPriorities, subMenu]
            setSelectedPriorities(priority);
        } else if (mainMenu === 'Status' && subMenu) {
            if(subMenu === 'All') {
                setSelectedStatuses([]);
                return;
            }
            const status = [...selectedStatuses, subMenu]
            setSelectedStatuses(status);
        }
    }

    const getChipIcon = (label: string) => {
        switch (label) {
            case 'Cancelled':
                return ChipCancelled;
            case 'Complete':
                return ChipComplete;
            case 'In Progress':
                return ChipInProgress;
            case 'Not Started':
                return ChipNotStarted;
            case 'Low':
                return ChipLow;
            case 'High':
                return ChipHigh;
            case 'Critical':
                return ChipCritical;
        }
    };

    const removeFilter = (label: string, type: 'status' | 'priority') => {
        if (type === 'status') {
            setSelectedStatuses(selectedStatuses.filter((status) => status !== label));
        } else {
            setSelectedPriorities(selectedPriorities.filter((priority) => priority !== label));
        }
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <DashboardComponent>
            <Typography variant="h4" gutterBottom>
                To-do
            </Typography>
            <FilterContainerBox>

                <Box display="flex" alignItems="center">
                    <FilterComponent
                        menuItems={menuItems}
                        buttonLabel="Filter"
                        onSubMenuItemClick={(mainMenu, subMenu) => handleFilter(mainMenu, subMenu)}
                    />
                    <Box display="flex" ml={1}>
                     { selectedStatuses &&  (selectedStatuses.map((status) => (
                            <FilterIconImg
                                key={status}
                                src={getChipIcon(status)}
                                alt={status}
                                onClick={() => removeFilter(status, 'status')}
                            />
                        ))) }
                        { selectedPriorities && (selectedPriorities.map((priority) => (
                            <FilterIconImg
                                key={priority}
                                src={getChipIcon(priority)}
                                alt={priority}
                                onClick={() => removeFilter(priority, 'priority')}
                            />
                        )))}
                    </Box>
                </Box>
                <IconButton onClick={() => navigate('/create-task')} style={{ padding: '0px'}}>
                    <img src={NewTaskButtonIcon} alt="New Task" style={{ height: '45px' }} />
                </IconButton>
            </FilterContainerBox>
            <TableContainer>
                <DataGrid
                    rows={filteredTasks}
                    columns={columns}
                    getRowId={(row) => row.id}
                    hideFooter
                />
            </TableContainer>
            <DeleteConfirmationModal
                open={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmDelete}
                firstLabel={`${selectedRows.length} Task${selectedRows.length !== 1 ? 's' : ''} will be deleted.`}
                secondLabel={null}
            />
        </DashboardComponent>
    );
};

export default TaskListComponent;