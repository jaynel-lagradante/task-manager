import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    TextField,
    Container,
    Typography,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Divider,
    IconButton,
    Paper,
    Grid,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import moment, { Moment } from 'moment';
import { Task } from '../types/TaskInterface';
import { CreateTask, GetFiles, GetTaskById, UpdateTask, UploadFiles } from '../services/TaskService';
import DashboardComponent from './DashboardComponent';
import SubtaskComponent from './SubTaskComponent';
import NewSubtaskIconSelected from './../assets/Buttons/Button_New Subtask_selected.svg';
import NewSubtaskIconActive from './../assets/Buttons/Button_New Subtask_active.svg';
import NewSubtaskIconInactive from './../assets/Buttons/Button_New Subtask_inactive.svg';
import { FormContainer } from '../layouts/TaskStyles';
import SaveButton from './../assets/Buttons/Button_Save.svg';
import CancelButton from './../assets/Buttons/Button_Cancel.svg';
import { createSubtasks, deleteSubtask, getSubtasks, updateSubtasks } from '../services/SubtaskService';
import { Subtask } from '../types/SubTaskInterface';
import MarkAsCompleteButton from './../assets/Buttons/Button_Mark as Complete.svg';
import AttachmentComponent from './AttachmentComponent';
import { Attachment } from '../types/AttachmentInterface';

const TaskComponent: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const [task, setTask] = useState<Task>({
        title: 'Task 01',
        due_date: null,
        priority: 'Low',
        status: 'Not Started',
        description: '',
        subtasks: [],
        date_completed: null,
    });
    const [error, setError] = useState('');
    const [dateCreated] = useState(moment());
    const [subtasks, setSubtasks] = useState<Subtask[]>([]);
    const [titleError, setTitleError] = useState('');
    const [dueDateError, setDueDateError] = useState('');
    const [completionDate, setCompletionDate] = useState<Moment | null>(null);
    const [isAddSubtaskHovered, setIsAddSubtaskHovered] = useState(false);
    const [subtaskTitleErrors, setSubtaskTitleErrors] = useState<string[]>([]);
    const [isMarkAsComplete, setIsMarkAsComplete] = useState(false);
    const [attachmentFiles, setAttachmentFiles] = useState<Attachment[]>([]);
    const [attachmentData, setAttachmentData] = useState<Attachment[]>([]);

    useEffect(() => {
        const fetchTask = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            if (id) {
                try {
                    const data = await GetTaskById(id);
                    const subtasksData = await getSubtasks(id);
                    const attachmentsData = await GetFiles(id);

                    if (attachmentsData.length > 0) {
                        setAttachmentData(attachmentsData);
                    }

                    setTask({
                        ...data,
                        due_date: data.due_date ? moment(data.due_date) : null,
                    });
                    if (subtasksData) {
                        setSubtasks(subtasksData || []);
                    }
                    if (data.status === 'Complete') {
                        setCompletionDate(moment(data.completion_date));
                    }
                } catch (err: any) {
                    setError(err.response?.data?.message || 'Failed to fetch task');
                    navigate('/login');
                }
            }
        };
        fetchTask();
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'title' && titleError) {
            setTitleError('');
        }
        setTask({ ...task, [name]: value });
    };

    const handleSelectChange = (e: any) => {
        const { name, value } = e.target;
        if (value === 'Complete') {
            setCompletionDate(moment());
        } else if (task.status === 'Complete') {
            setCompletionDate(null);
        }
        setTask({ ...task, [name]: value });
    };

    const handleDateChange = (date: Moment | null) => {
        if (date) {
            if (date.isBefore(dateCreated, 'day')) {
                setDueDateError('Must be later than Date Created');
            } else {
                setDueDateError('');
            }
        } else {
            setDueDateError('Due Date is required');
        }
        setTask({ ...task, due_date: date });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setTitleError('');
        setDueDateError('');
        setSubtaskTitleErrors([]);

        let hasError = false;

        if (!task.title.trim()) {
            setTitleError('Must not be empty');
            hasError = true;
        }

        if (!task.due_date) {
            setDueDateError('Due Date is required');
            hasError = true;
        } else if (task.due_date.isBefore(dateCreated, 'day')) {
            setDueDateError('Must be later than Date Created');
            hasError = true;
        }

        const newSubtaskTitleErrors = subtasks.map((subtask) => (!subtask.title.trim() ? 'Must not be empty' : ''));
        setSubtaskTitleErrors(newSubtaskTitleErrors);

        if (newSubtaskTitleErrors.some((error) => error)) {
            hasError = true;
        }

        if (hasError) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            const taskData: Task = {
                title: task.title,
                due_date: task.due_date,
                priority: task.priority,
                status: isMarkAsComplete ? 'Complete' : task.status,
                description: task.description,
                date_completed: completionDate,
            };

            let response;
            if (id) {
                response = await UpdateTask(id, taskData);
            } else {
                response = await CreateTask(taskData);
            }

            const newSubTask = subtasks.filter((subtask) => !subtask.hasOwnProperty('id'));
            const updatedSubtasks = subtasks.filter((subtask) => subtask.hasOwnProperty('id'));
            if (newSubTask.length > 0) {
                const subtaskData = await createSubtasks(id ?? response.id, newSubTask);
                setSubtasks(subtaskData.createdSubtasks);
            }
            if (updatedSubtasks.length > 0) {
                await updateSubtasks(updatedSubtasks);
            }

            if (attachmentFiles && attachmentFiles.length > 0) {
                const files = attachmentFiles.map((attachment) => attachment.file);
                await UploadFiles(response.id || id, files);
            }

            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save task');
        }
    };

    const handleAddSubtask = () => {
        setSubtasks([...subtasks, { title: '', status: 'Not Done' }]);
    };

    const handleSubtaskTitleChange = (index: number, title: string) => {
        setSubtasks(subtasks.map((subtask, i) => (i === index ? { ...subtask, title } : subtask)));

        const newErrors = [...subtaskTitleErrors];
        if (!title.trim()) {
            newErrors[index] = 'Must not be empty';
        } else {
            newErrors[index] = '';
        }
        setSubtaskTitleErrors(newErrors);
    };

    const handleSubtaskStatusChange = (index: number, status: string) => {
        setSubtasks(subtasks.map((subtask, i) => (i === index ? { ...subtask, status } : subtask)));
    };

    const handleDeleteSubtask = async (index: number, subtaskId: string | null) => {
        if (subtaskId) {
            try {
                await deleteSubtask(subtaskId);
                setSubtasks(subtasks.filter((subtask) => subtask?.id !== subtaskId));
            } catch (error) {
                console.error('Error deleting subtask:', error);
            }
        } else {
            setSubtasks(subtasks.filter((_, i) => i !== index));
        }
    };

    const disableCompleteStatus = () => {
        return (subtasks.length > 0 && subtasks.every((subtask) => subtask.status === 'Done')) || subtasks.length === 0;
    };

    const handleMarkAsComplete = () => {
        setIsMarkAsComplete(true);
        setCompletionDate(moment());
        setTask({ ...task, status: 'Complete' });
    };

    const showMarkAsComplete =
        subtasks.length > 0 && subtasks.every((subtask) => subtask.status === 'Done') && task.status !== 'Complete';

    const handleAttachmentFilesChange = (files: Attachment[]) => {
        setAttachmentFiles(files);
    };

    return (
        <DashboardComponent>
            <FormContainer>
                <Typography variant="h6" gutterBottom>
                    Back | View Task / Edit
                </Typography>
                <Paper style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)', height: '100%' }}>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <Container maxWidth="md" style={{ paddingBottom: '16px' }}>
                            <Box mt={4}>
                                {error && <Typography color="error">{error}</Typography>}
                                <form>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={3}>
                                            <FormControl fullWidth margin="normal">
                                                <InputLabel id="priority-label">Priority</InputLabel>
                                                <Select
                                                    labelId="priority-label"
                                                    name="priority"
                                                    value={task.priority}
                                                    onChange={handleSelectChange}
                                                    label="Priority"
                                                    disabled={!!id}
                                                >
                                                    <MenuItem value="Low">Low</MenuItem>
                                                    <MenuItem value="High">High</MenuItem>
                                                    <MenuItem value="Critical">Critical</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={3}>
                                            <FormControl fullWidth margin="normal">
                                                <InputLabel id="status-label">Status</InputLabel>
                                                <Select
                                                    labelId="status-label"
                                                    name="status"
                                                    value={task.status}
                                                    onChange={handleSelectChange}
                                                    label="Status"
                                                    disabled={isMarkAsComplete}
                                                >
                                                    <MenuItem value="Not Started">Not Started</MenuItem>
                                                    <MenuItem value="In Progress">In Progress</MenuItem>
                                                    <MenuItem value="Complete" disabled={!disableCompleteStatus()}>
                                                        Complete
                                                    </MenuItem>
                                                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        {task.status === 'Complete' && (
                                            <Grid item xs={12} sm={3}>
                                                <TextField
                                                    label="Completion Date"
                                                    value={completionDate ? completionDate.format('MM/DD/YYYY') : ''}
                                                    fullWidth
                                                    margin="normal"
                                                    disabled
                                                />
                                            </Grid>
                                        )}
                                        <Grid item xs={12}>
                                            <TextField
                                                label="Title"
                                                name="title"
                                                value={task.title}
                                                onChange={handleInputChange}
                                                fullWidth
                                                margin="normal"
                                                multiline
                                                rows={4}
                                                disabled={!!id}
                                                error={!!titleError}
                                                helperText={titleError}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="Date Created"
                                                value={dateCreated.format('MM/DD/YYYY')}
                                                fullWidth
                                                margin="normal"
                                                disabled
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <DatePicker
                                                label="Due Date"
                                                value={task.due_date}
                                                onChange={(date) => handleDateChange(date)}
                                                format="MM/DD/YYYY"
                                                slotProps={{
                                                    textField: {
                                                        fullWidth: true,
                                                        margin: 'normal',
                                                        error: !!dueDateError,
                                                        helperText: dueDateError,
                                                    },
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                label="Details"
                                                name="description"
                                                value={task.description}
                                                onChange={handleInputChange}
                                                fullWidth
                                                margin="normal"
                                                multiline
                                                rows={6}
                                            />
                                        </Grid>
                                    </Grid>
                                </form>

                                <AttachmentComponent
                                    onFilesChange={handleAttachmentFilesChange}
                                    attachments={attachmentData}
                                />

                                <Divider style={{ width: '100%', marginTop: '32px' }} />

                                <Box
                                    mt={2}
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    style={{ marginBottom: '16px', marginTop: '4px' }}
                                >
                                    <Typography variant="h6" gutterBottom>
                                        Subtask
                                    </Typography>
                                    <IconButton
                                        onClick={handleAddSubtask}
                                        disabled={task.status === 'Complete'}
                                        onMouseEnter={() => setIsAddSubtaskHovered(true)}
                                        onMouseLeave={() => setIsAddSubtaskHovered(false)}
                                    >
                                        {task.status === 'Complete' ? (
                                            <img
                                                src={NewSubtaskIconInactive}
                                                alt="Add Subtask"
                                                style={{ height: '40px' }}
                                            />
                                        ) : isAddSubtaskHovered ? (
                                            <img
                                                src={NewSubtaskIconSelected}
                                                alt="Add Subtask"
                                                style={{ height: '40px' }}
                                            />
                                        ) : (
                                            <img
                                                src={NewSubtaskIconActive}
                                                alt="Add Subtask"
                                                style={{ height: '40px' }}
                                            />
                                        )}
                                    </IconButton>
                                </Box>

                                {subtasks.map((subtask, index) => (
                                    <SubtaskComponent
                                        key={index}
                                        subtask={subtask}
                                        index={index}
                                        onTitleChange={handleSubtaskTitleChange}
                                        onStatusChange={handleSubtaskStatusChange}
                                        onDelete={() => handleDeleteSubtask(index, subtask.id ?? null)}
                                        titleError={subtaskTitleErrors[index]}
                                    />
                                ))}
                            </Box>
                        </Container>
                    </LocalizationProvider>
                </Paper>

                <Box display="flex" justifyContent="flex-end" marginTop="32px" marginRight="16px">
                    <IconButton onClick={() => navigate('/')}>
                        <img src={CancelButton} alt="Add Subtask" style={{ height: '40px' }} />
                    </IconButton>
                    {showMarkAsComplete && !isMarkAsComplete ? (
                        <IconButton onClick={handleMarkAsComplete}>
                            <img src={MarkAsCompleteButton} alt="Mark as Complete" style={{ height: '40px' }} />
                        </IconButton>
                    ) : (
                        <IconButton onClick={handleSubmit}>
                            <img src={SaveButton} alt="Add Subtask" style={{ height: '40px' }} />
                        </IconButton>
                    )}
                </Box>
            </FormContainer>
        </DashboardComponent>
    );
};

export default TaskComponent;
