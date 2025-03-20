import React, { useState, useEffect } from 'react';
import { Typography, Box, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { GetTasks } from '../services/TaskService';
import DashboardComponent from './../components/DashboardComponent';
import NewTaskButtonIcon from './../assets/Buttons/Button_New Task.svg';
import { Task } from '../types/TaskInterface';
import FilterComponent from './../components/FilterComponent';
import ChipCancelled from '../assets/Chips/Chip_Cancelled.svg';
import ChipComplete from '../assets/Chips/Chip_Complete.svg';
import ChipInProgress from '../assets/Chips/Chip_In progress.svg';
import ChipNotStarted from '../assets/Chips/Chip_Not started.svg';
import ChipLow from '../assets/Chips/Chip_Low.svg';
import ChipHigh from '../assets/Chips/Chip_High.svg';
import ChipCritical from '../assets/Chips/Chip_Critical.svg';
import { FilterContainerBox, FilterIconImg, TableContainer } from '../layouts/TaskListStyles';
import TableComponent from './../components/TableComponent';

const TaskListPage: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const navigate = useNavigate();
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
    const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const fetchedTasks = await GetTasks();
                setTasks(fetchedTasks);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };
        fetchTasks();
    }, []);

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

    const menuItems = [
        {
            label: 'Priority',
            subMenu: [{ label: 'All' }, { label: 'Low' }, { label: 'High' }, { label: 'Critical' }],
        },
        {
            label: 'Status',
            subMenu: [
                { label: 'All' },
                { label: 'Not Started' },
                { label: 'In Progress' },
                { label: 'Complete' },
                { label: 'Cancelled' },
            ],
        },
    ];

    const handleFilter = (mainMenu: string | null, subMenu: string | null) => {
        if (mainMenu === 'Priority' && subMenu) {
            if (subMenu === 'All') {
                setSelectedPriorities([]);
                return;
            }
            const priority = [...selectedPriorities, subMenu];
            setSelectedPriorities(priority);
        } else if (mainMenu === 'Status' && subMenu) {
            if (subMenu === 'All') {
                setSelectedStatuses([]);
                return;
            }
            const status = [...selectedStatuses, subMenu];
            setSelectedStatuses(status);
        }
    };

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
                        {selectedStatuses &&
                            selectedStatuses.map((status) => (
                                <FilterIconImg
                                    key={status}
                                    src={getChipIcon(status)}
                                    alt={status}
                                    onClick={() => removeFilter(status, 'status')}
                                />
                            ))}
                        {selectedPriorities &&
                            selectedPriorities.map((priority) => (
                                <FilterIconImg
                                    key={priority}
                                    src={getChipIcon(priority)}
                                    alt={priority}
                                    onClick={() => removeFilter(priority, 'priority')}
                                />
                            ))}
                    </Box>
                </Box>
                <IconButton onClick={() => navigate('/create-task')} style={{ padding: '0px' }}>
                    <img src={NewTaskButtonIcon} alt="New Task" style={{ height: '45px' }} />
                </IconButton>
            </FilterContainerBox>
            <TableContainer>
                <TableComponent
                    data={filteredTasks}
                    getRowCanExpand={(row) => !!row.original.subtasks?.length}
                    setTasksValue={(tasks) => setTasks(tasks)}
                    handleEdit={(taskId) => navigate(`/view-task/${taskId}`)}
                ></TableComponent>
            </TableContainer>
        </DashboardComponent>
    );
};

export default TaskListPage;
