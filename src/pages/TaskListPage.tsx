import React, { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DashboardComponent from './../components/DashboardComponent';
import NewTaskButtonIcon from './../assets/Buttons/Button_New Task.svg';
import NewTaskButtonIconMobile from './../assets/Buttons/Button_New Task_mobile.svg';
import FilterComponent from './../components/FilterComponent';
import ChipCancelled from '../assets/Chips/Chip_Cancelled.svg';
import ChipComplete from '../assets/Chips/Chip_Complete.svg';
import ChipInProgress from '../assets/Chips/Chip_In progress.svg';
import ChipNotStarted from '../assets/Chips/Chip_Not started.svg';
import ChipLow from '../assets/Chips/Chip_Low.svg';
import ChipHigh from '../assets/Chips/Chip_High.svg';
import ChipCritical from '../assets/Chips/Chip_Critical.svg';
import { CuztomizedIconButton, FilterContainerBox, FilterIconImg, TableContainer } from '../layouts/TaskListStyles';
import TableComponent from './../components/TableComponent';
import { selectTasks, useTaskState } from '../state/TaskState';
import { STATUS } from '../constants/Status';
import { MESSAGES } from '../constants/Messages';
import { ROUTES } from '../constants/Routes';

const TaskListPage: React.FC = () => {
    const navigate = useNavigate();
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
    const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
    const { COMPLETE, CANCELLED, NOT_STARTED, IN_PROGRESS } = STATUS.TASK;
    const { LOW, HIGH, CRITICAL } = STATUS.TASK_PRIORITY;
    const { PRIORITY, STATUS_LABEL } = MESSAGES.LABEL;

    const tasks = useTaskState(selectTasks);
    const { fetchTasks, setTasks } = useTaskState();
    useEffect(() => {
        if (tasks.length === 0) fetchTasks();
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
            label: PRIORITY,
            subMenu: [{ label: 'All' }, { label: LOW }, { label: HIGH }, { label: CRITICAL }],
        },
        {
            label: STATUS_LABEL,
            subMenu: [
                { label: 'All' },
                { label: NOT_STARTED },
                { label: IN_PROGRESS },
                { label: COMPLETE },
                { label: CANCELLED },
            ],
        },
    ];

    const handleFilter = (mainMenu: string | null, subMenu: string | null) => {
        if (mainMenu === PRIORITY && subMenu) {
            if (subMenu === 'All') {
                setSelectedPriorities([]);
                return;
            }
            if (!selectedPriorities.includes(subMenu)) {
                const priority = [...selectedPriorities, subMenu];
                setSelectedPriorities(priority);
            }
        } else if (mainMenu === STATUS_LABEL && subMenu) {
            if (subMenu === 'All') {
                setSelectedStatuses([]);
                return;
            }
            if (!selectedStatuses.includes(subMenu)) {
                const status = [...selectedStatuses, subMenu];
                setSelectedStatuses(status);
            }
        }
    };

    const getChipIcon = (label: string) => {
        switch (label) {
            case CANCELLED:
                return ChipCancelled;
            case COMPLETE:
                return ChipComplete;
            case IN_PROGRESS:
                return ChipInProgress;
            case NOT_STARTED:
                return ChipNotStarted;
            case LOW:
                return ChipLow;
            case HIGH:
                return ChipHigh;
            case CRITICAL:
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
                <Box className="filterContainer">
                    <FilterComponent
                        menuItems={menuItems}
                        buttonLabel="Filter"
                        onSubMenuItemClick={(mainMenu, subMenu) => handleFilter(mainMenu, subMenu)}
                    />
                    <Box className="filterIconContainer">
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
                <CuztomizedIconButton onClick={() => navigate(ROUTES.CREATE_TASK)}>
                    <img className="newTask" src={NewTaskButtonIcon} alt="New Task" />
                    <img className="newTaskMobile" src={NewTaskButtonIconMobile} alt="New Task" />
                </CuztomizedIconButton>
            </FilterContainerBox>
            <TableContainer>
                <TableComponent
                    data={filteredTasks}
                    getRowCanExpand={(row) => !!row.original.subtasks?.length}
                    setTasksValue={setTasks}
                    handleEdit={(taskId) => navigate(`${ROUTES.EDIT_TASK}/${taskId}`)}
                    handleView={(taskId) => navigate(`${ROUTES.VIEW_TASK}/${taskId}`)}
                ></TableComponent>
            </TableContainer>
        </DashboardComponent>
    );
};

export default TaskListPage;
