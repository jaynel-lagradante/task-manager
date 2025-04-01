import { Fragment, JSX, useState } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getExpandedRowModel,
    getSortedRowModel,
    ColumnDef,
    flexRender,
    Row,
} from '@tanstack/react-table';
import {
    Table as MuiTable,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Box,
    Checkbox,
} from '@mui/material';
import moment from 'moment';
import { Task } from '../types/TaskInterface';
import NotStartedIcon from './../assets/Icons/Not Started.svg';
import InProgressIcon from './../assets/Icons/In Progress.svg';
import CompleteIcon from './../assets/Icons/Complete.svg';
import CancelledIcon from './../assets/Icons/Cancelled.svg';
import DeleteActiveIcon from './../assets/Icons/Delete_active.svg';
import DeleteInactiveIcon from './../assets/Icons/Delete_inactive.svg';
import { CuztomizedHeaderBox, DeleteButtonBadge } from '../layouts/DashboardStyles';
import ModalComponent from './ModalComponent';
import { DeleteTask } from '../services/TaskService';
import EditIcon from './../assets/Icons/Edit.svg';
import AccordionExpandIcon from './../assets/Icons/Accordion_expand.svg';
import AccordionSuppressIcon from './../assets/Icons/Accordion_supress.svg';
import SortDesktopIcon from './../assets/Icons/Sort_desktop.svg';
import {
    CuztomizedImg,
    EditImg,
    ExpandCustomizeBox,
    PriorityImg,
    RenderedContainer,
    SortContainer,
    StatusContainer,
    TitleContainer,
} from '../layouts/TableStyle';
import DoneIcon from './../assets/Icons/Done.svg';
import NotDoneIcon from './../assets/Icons/Not Done.svg';
import LowPriorityIcon from './../assets/Icons/Low_table.svg';
import HighPriorityIcon from './../assets/Icons/High_table.svg';
import CriticalPriorityIcon from './../assets/Icons/Critical_table.svg';
import AttachmentIcon from './../assets/Icons/attachment.svg';
import { MESSAGES } from '../constants/Messages';
import { STATUS } from '../constants/Status';
import { TEMPLATE } from '../layouts/TemplateStyles';

type TableProps<TData> = {
    data: TData[];
    getRowCanExpand: (row: Row<TData>) => boolean;
    setTasksValue: (tasks: Task[]) => void;
    handleEdit?: (taskId: string) => void;
    handleView?: (taskId: string) => void;
};

const renderSubComponent = ({ row }: { row: Row<Task> }) => {
    const subtasks = row.original.subtasks;
    const { DONE, NOT_DONE } = STATUS.SUBTASK;
    if (!row.original.subtasks || row.original.subtasks.length === 0) {
        return null;
    }

    return (
        <>
            {subtasks &&
                subtasks.map((subtask, index) => {
                    let statusIcon = null;
                    if (subtask.status === DONE) {
                        statusIcon = DoneIcon;
                    } else if (subtask.status === NOT_DONE) {
                        statusIcon = NotDoneIcon;
                    }

                    return (
                        <RenderedContainer key={index}>
                            <div className="title">{subtask.title}</div>
                            <div className="status">
                                {statusIcon && <img src={statusIcon} alt={subtask.status} />}
                                <span>{subtask.status}</span>
                            </div>
                        </RenderedContainer>
                    );
                })}
        </>
    );
};

const TableComponent = ({
    data,
    getRowCanExpand,
    setTasksValue,
    handleEdit,
    handleView,
}: TableProps<Task>): JSX.Element => {
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const DUE_DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';
    const DUE_DATE_DISPLAY_FORMAT = 'MM/DD/YYYY';

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
            const updatedTasks = data.filter((task) => {
                if (task.id) {
                    return !selectedRows.includes(task.id);
                }
                return true;
            });
            setTasksValue(updatedTasks);
            setSelectedRows([]);
            setIsModalOpen(false);
        } catch (error) {
            console.error(MESSAGES.ERROR.DELETE_SUBTASK, error);
        }
    };

    const tableColumns: ColumnDef<Task>[] = [
        {
            id: 'selection',
            header: () =>
                selectedRows.length > 0 ? (
                    <CuztomizedHeaderBox>
                        <DeleteButtonBadge badgeContent={selectedRows.length} color="primary">
                            <IconButton onClick={handleDeleteSelected}>
                                <CuztomizedImg src={DeleteActiveIcon} alt="Delete" />
                            </IconButton>
                        </DeleteButtonBadge>
                    </CuztomizedHeaderBox>
                ) : (
                    <Box>
                        <IconButton disabled>
                            <CuztomizedImg src={DeleteInactiveIcon} alt="Delete" />
                        </IconButton>
                    </Box>
                ),
            cell: ({ row }) => (
                <Checkbox
                    checked={selectedRows.includes(row.original.id ?? '')}
                    onChange={(e) => {
                        if (e.target.checked) {
                            setSelectedRows([...selectedRows, row.original.id ?? '']);
                        } else {
                            setSelectedRows(selectedRows.filter((id) => id !== row.original.id));
                        }
                    }}
                />
            ),
            size: 50,
        },
        {
            id: 'expand',
            header: '',
            cell: ({ row }) => (
                <ExpandCustomizeBox>
                    {row.getCanExpand() && (
                        <IconButton onClick={row.getToggleExpandedHandler()} size="small">
                            {row.getIsExpanded() ? (
                                <img src={AccordionExpandIcon} alt="Expand" className="expand" />
                            ) : (
                                <img src={AccordionSuppressIcon} alt="Suppress" className="suppress" />
                            )}
                        </IconButton>
                    )}
                </ExpandCustomizeBox>
            ),
            size: 5,
        },
        {
            accessorKey: 'title',
            header: 'Title',
            cell: ({ row, getValue }) => (
                <TitleContainer>
                    <Box
                        className="title"
                        sx={{ paddingLeft: `${row.depth * 2}rem` }}
                        onClick={() => handleView && handleView(row.original.id ?? '')}
                    >
                        {getValue<string>()}
                    </Box>
                    {row.original.hasAttachment && <img src={AttachmentIcon} alt="Attachment" />}
                </TitleContainer>
            ),
        },
        {
            accessorFn: (row) => (row.due_date ? moment(row.due_date).format(DUE_DATE_FORMAT) : 'N/A'),
            id: 'due_date',
            cell: ({ row, getValue }) => {
                const dueDate = getValue<string>();
                const today = moment();
                const taskDueDate = dueDate !== 'N/A' ? moment(dueDate) : null;
                const isOverdue = taskDueDate && taskDueDate.isBefore(today, 'day');
                const isDueToday = taskDueDate && taskDueDate.isSame(today, 'day');
                const { COMPLETE, CANCELLED } = STATUS.TASK;
                const { CRITICAL } = STATUS.TASK_PRIORITY;
                const { OVERDUE, DUE_DATE } = TEMPLATE.COLOR;
                const isNearingDueDate =
                    taskDueDate &&
                    taskDueDate.isAfter(today) &&
                    row.original.status !== COMPLETE &&
                    row.original.status !== CANCELLED &&
                    (row.original.priority === CRITICAL
                        ? taskDueDate.diff(today, 'hours') <= 48
                        : taskDueDate.diff(today, 'hours') <= 24);

                let color = '';
                let statusText = '';
                let fontWeight = 'bold';

                if (row.original.status === COMPLETE) {
                    color = '';
                    statusText = '';
                    fontWeight = 'normal';
                } else if (isOverdue) {
                    color = OVERDUE;
                    statusText = 'Overdue';
                } else if (isDueToday) {
                    color = DUE_DATE;
                    statusText = 'Today';
                } else if (isNearingDueDate) {
                    color = DUE_DATE;
                    statusText = 'Nearing Due Date';
                } else {
                    fontWeight = 'normal';
                }

                return (
                    <div>
                        <div style={{ color: color, fontWeight: fontWeight }}>
                            {dueDate !== 'N/A' ? moment(dueDate).format(DUE_DATE_DISPLAY_FORMAT) : 'N/A'}
                        </div>
                        {statusText && (
                            <Box sx={{ color: color, fontSize: '12px', fontWeight: fontWeight }}>{statusText}</Box>
                        )}
                    </div>
                );
            },
            header: () => <span>Due Date</span>,
        },
        {
            accessorKey: 'priority',
            header: () => 'Priority',
            cell: ({ getValue }) => {
                const priority = getValue<string>();
                const { LOW, HIGH, CRITICAL } = STATUS.TASK_PRIORITY;
                let icon = null;

                switch (priority) {
                    case LOW:
                        icon = LowPriorityIcon;
                        break;
                    case HIGH:
                        icon = HighPriorityIcon;
                        break;
                    case CRITICAL:
                        icon = CriticalPriorityIcon;
                        break;
                }

                return <div>{icon && <PriorityImg src={icon} alt={priority} />}</div>;
            },
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ getValue }) => {
                const status = getValue<string>();
                const { NOT_STARTED, IN_PROGRESS, COMPLETE, CANCELLED } = STATUS.TASK;
                let icon;

                switch (status) {
                    case NOT_STARTED:
                        icon = NotStartedIcon;
                        break;
                    case IN_PROGRESS:
                        icon = InProgressIcon;
                        break;
                    case COMPLETE:
                        icon = CompleteIcon;
                        break;
                    case CANCELLED:
                        icon = CancelledIcon;
                        break;
                    default:
                        icon = null;
                }

                return (
                    <StatusContainer>
                        {icon && <img src={icon} alt={status} />}
                        <span>{status}</span>
                    </StatusContainer>
                );
            },
        },
        {
            id: 'edit',
            header: '',
            cell: ({ row }) => (
                <EditImg src={EditIcon} alt="Edit" onClick={() => handleEdit && handleEdit(row.original.id ?? '')} />
            ),
            size: 15,
        },
    ];

    const columns = tableColumns;
    const table = useReactTable<Task>({
        data,
        columns,
        getRowCanExpand,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <TableContainer>
            <MuiTable>
                <TableHead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableCell
                                        key={header.id}
                                        colSpan={header.colSpan}
                                        sx={{
                                            width: header.column.columnDef.size ?? '100%',
                                            maxWidth: header.column.columnDef.size ?? '100%',
                                        }}
                                    >
                                        {header.isPlaceholder ? null : (
                                            <SortContainer onClick={header.column.getToggleSortingHandler()}>
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {header.column.getIsSorted() && (
                                                    <img src={SortDesktopIcon} alt="Sort" />
                                                )}
                                            </SortContainer>
                                        )}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableHead>
                <TableBody>
                    {table.getRowModel().rows.map((row) => {
                        return (
                            <Fragment key={row.id}>
                                <TableRow>
                                    {row.getVisibleCells().map((cell) => {
                                        return (
                                            <TableCell
                                                key={cell.id}
                                                sx={{
                                                    maxWidth: cell.column.columnDef.size ?? '100%',
                                                }}
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                                {row.getIsExpanded() && (
                                    <TableRow>
                                        <TableCell colSpan={row.getVisibleCells().length} style={{ padding: 0 }}>
                                            {renderSubComponent({ row })}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </Fragment>
                        );
                    })}
                </TableBody>
            </MuiTable>

            <ModalComponent
                open={isModalOpen}
                onCloseLabel={MESSAGES.BUTTON.CANCEL}
                onConfirmLabel={MESSAGES.BUTTON.DELETE}
                onClose={handleCloseModal}
                onConfirm={handleConfirmDelete}
                firstLabel={`${selectedRows.length} Task${selectedRows.length !== 1 ? 's' : ''} will be deleted.`}
                secondLabel={null}
            />
        </TableContainer>
    );
};

export default TableComponent;
