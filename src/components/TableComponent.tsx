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
import DeleteConfirmationModal from './DeleteConfirmationModalComponent';
import { DeleteTask } from '../services/TaskService';
import EditIcon from './../assets/Icons/Edit.svg';
import AccordionExpandIcon from './../assets/Icons/Accordion_expand.svg';
import AccordionSuppressIcon from './../assets/Icons/Accordion_supress.svg';
import SortDesktopIcon from './../assets/Icons/Sort_desktop.svg';
import { CuztomizedImg, RenderedContainer } from '../layouts/TableStyle';
import DoneIcon from './../assets/Icons/Done.svg';
import NotDoneIcon from './../assets/Icons/Not Done.svg';
import LowPriorityIcon from './../assets/Icons/Low_table.svg';
import HighPriorityIcon from './../assets/Icons/High_table.svg';
import CriticalPriorityIcon from './../assets/Icons/Critical_table.svg';
import AttachmentIcon from './../assets/Icons/attachment.svg';

type TableProps<TData> = {
    data: TData[];
    getRowCanExpand: (row: Row<TData>) => boolean;
    setTasksValue: (tasks: Task[]) => void;
    handleEdit?: (taskId: string) => void;
};

const renderSubComponent = ({ row }: { row: Row<Task> }) => {
    const subtasks = row.original.subtasks;
    if (!row.original.subtasks || row.original.subtasks.length === 0) {
        return null;
    }

    return (
        <>
            {subtasks &&
                subtasks.map((subtask) => {
                    let statusIcon = null;
                    if (subtask.status === 'Done') {
                        statusIcon = DoneIcon;
                    } else if (subtask.status === 'Not Done') {
                        statusIcon = NotDoneIcon;
                    }

                    return (
                        <RenderedContainer key={subtask.id}>
                            <div className="title">{subtask.title}</div>
                            <div className="status" style={{ display: 'flex', alignItems: 'center' }}>
                                {statusIcon && (
                                    <img
                                        src={statusIcon}
                                        alt={subtask.status}
                                        style={{ height: '10px', marginRight: '8px' }}
                                    />
                                )}
                                <span>{subtask.status}</span>
                            </div>
                        </RenderedContainer>
                    );
                })}
        </>
    );
};

const TableComponent = ({ data, getRowCanExpand, setTasksValue, handleEdit }: TableProps<Task>): JSX.Element => {
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
            console.error('Error deleting selected tasks:', error);
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
        },
        {
            id: 'expand',
            header: '',
            cell: ({ row }) =>
                row.getCanExpand() && (
                    <IconButton onClick={row.getToggleExpandedHandler()} size="small">
                        {row.getIsExpanded() ? (
                            <img src={AccordionExpandIcon} alt="Expand" style={{ height: '6px' }} />
                        ) : (
                            <img src={AccordionSuppressIcon} alt="Suppress" style={{ height: '10px' }} />
                        )}
                    </IconButton>
                ),
        },
        {
            accessorKey: 'title',
            header: 'Title',
            cell: ({ row, getValue }) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div
                        style={{ paddingLeft: `${row.depth * 2}rem`, fontWeight: 'bold', textDecoration: 'underline' }}
                    >
                        {getValue<string>()}
                    </div>
                    {row.original.hasAttachment && (
                        <img src={AttachmentIcon} alt="Attachment" style={{ height: '20px', marginLeft: '8px' }} />
                    )}
                </div>
            ),
        },
        {
            accessorFn: (row) => (row.due_date ? moment(row.due_date).format('YYYY-MM-DD HH:mm:ss') : 'N/A'),
            id: 'due_date',
            cell: ({ row, getValue }) => {
                const dueDate = getValue<string>();
                const today = moment();
                const taskDueDate = dueDate !== 'N/A' ? moment(dueDate) : null;
                const isOverdue = taskDueDate && taskDueDate.isBefore(today, 'day');
                const isDueToday = taskDueDate && taskDueDate.isSame(today, 'day');
                const isNearingDueDate =
                    taskDueDate &&
                    taskDueDate.isAfter(today) &&
                    row.original.status !== 'Complete' &&
                    row.original.status !== 'Cancelled' &&
                    (row.original.priority === 'Critical'
                        ? taskDueDate.diff(today, 'hours') <= 48
                        : taskDueDate.diff(today, 'hours') <= 24);

                let color = '';
                let statusText = '';
                let fontWeight = 'normal';

                if (row.original.status === 'Complete') {
                    color = '';
                    statusText = '';
                    fontWeight = 'normal';
                } else if (isOverdue) {
                    color = '#CA0061';
                    statusText = 'Overdue';
                    fontWeight = 'bold';
                } else if (isDueToday) {
                    color = '#009292';
                    statusText = 'Today';
                    fontWeight = 'bold';
                } else if (isNearingDueDate) {
                    color = '#EB0000';
                    statusText = 'Nearing Due Date';
                    fontWeight = 'bold';
                }

                return (
                    <div>
                        <div style={{ color: color, fontWeight: fontWeight }}>
                            {dueDate !== 'N/A' ? moment(dueDate).format('YYYY-MM-DD HH:mm') : 'N/A'}
                        </div>
                        {statusText && (
                            <div style={{ color: color, fontSize: '12px', fontWeight: fontWeight }}>{statusText}</div>
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
                let icon = null;

                switch (priority) {
                    case 'Low':
                        icon = LowPriorityIcon;
                        break;
                    case 'High':
                        icon = HighPriorityIcon;
                        break;
                    case 'Critical':
                        icon = CriticalPriorityIcon;
                        break;
                }

                return <div>{icon && <img src={icon} alt={priority} style={{ height: '20px' }} />}</div>;
            },
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ getValue }) => {
                const status = getValue<string>();
                let icon;

                switch (status) {
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
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {icon && <img src={icon} alt={status} style={{ height: '20px', marginRight: '8px' }} />}
                        <span>{status}</span>
                    </div>
                );
            },
        },
        {
            id: 'edit',
            header: '',
            cell: ({ row }) => (
                <img
                    src={EditIcon}
                    alt="Edit"
                    style={{ height: '20px', cursor: 'pointer' }}
                    onClick={() => handleEdit && handleEdit(row.original.id ?? '')}
                />
            ),
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
                                    <TableCell key={header.id} colSpan={header.colSpan}>
                                        {header.isPlaceholder ? null : (
                                            <div
                                                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                                onClick={header.column.getToggleSortingHandler()}
                                            >
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {header.column.getIsSorted() && (
                                                    <img
                                                        src={SortDesktopIcon}
                                                        alt="Sort"
                                                        style={{ height: '15px', marginLeft: '5px' }}
                                                    />
                                                )}
                                            </div>
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
                                            <TableCell key={cell.id}>
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

            <DeleteConfirmationModal
                open={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmDelete}
                firstLabel={`${selectedRows.length} Task${selectedRows.length !== 1 ? 's' : ''} will be deleted.`}
                secondLabel={null}
            />
        </TableContainer>
    );
};

export default TableComponent;
