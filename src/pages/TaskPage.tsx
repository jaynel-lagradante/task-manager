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
    Grid,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import moment, { Moment } from 'moment';
import { Task } from '../types/TaskInterface';
import { CreateTask, GetTaskById, UpdateTask } from '../services/TaskService';
import { GetFiles, UploadFiles } from '../services/FileService';
import DashboardComponent from './../components/DashboardComponent';
import SubtaskComponent from './../components/SubTaskComponent';
import NewSubtaskIconSelected from './../assets/Buttons/Button_New Subtask_selected.svg';
import NewSubtaskIconActive from './../assets/Buttons/Button_New Subtask_active.svg';
import NewSubtaskIconInactive from './../assets/Buttons/Button_New Subtask_inactive.svg';
import { CuztomizedImg, CuztomizedPaper, FormContainer } from '../layouts/TaskStyles';
import SaveButton from './../assets/Buttons/Button_Save.svg';
import CancelButton from './../assets/Buttons/Button_Cancel.svg';
import { createSubtasks, deleteSubtask, getSubtasks, updateSubtasks } from '../services/SubtaskService';
import { Subtask } from '../types/SubTaskInterface';
import MarkAsCompleteButton from './../assets/Buttons/Button_Mark as Complete.svg';
import AttachmentComponent from './../components/AttachmentComponent';
import { Attachment } from '../types/AttachmentInterface';
import BackIcon from '../assets/Icons/Back.svg';
import { useTaskState } from '../state/TaskState';

const TaskPage: React.FC = () => {
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
    const [detailsError, setDetailsError] = useState('');
    const [dueDateError, setDueDateError] = useState('');
    const [completionDate, setCompletionDate] = useState<Moment | null>(null);
    const [isAddSubtaskHovered, setIsAddSubtaskHovered] = useState(false);
    const [subtaskTitleErrors, setSubtaskTitleErrors] = useState<string[]>([]);
    const [isMarkAsComplete, setIsMarkAsComplete] = useState(false);
    const [attachmentFiles, setAttachmentFiles] = useState<Attachment[]>([]);
    const [attachmentData, setAttachmentData] = useState<Attachment[]>([]);
    const [subTaskError, setSubTaskError] = useState('');
    const { updateTaskInState, addTask } = useTaskState();

    useEffect(() => {
        const fetchTask = async () => {
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
                }
            }
        };
        fetchTask();
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'title') {
            if (titleError) setTitleError('');
            if (value.length > 25) {
                setTitleError('Must be at most 25 characters');
            }
        } else if (name === 'description') {
            if (detailsError) setDetailsError('');
            if (value.length > 300) {
                setDetailsError('Must be at most 300 characters');
            }
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
        } else if (task.title.length > 25) {
            setTitleError('Must be at most 25 characters');
            hasError = true;
        }

        if (task.description.length > 300) {
            setDetailsError('Must be at most 300 characters');
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
                updateTaskInState(taskData);
            } else {
                response = await CreateTask(taskData);
                addTask({ ...taskData, id: response.id });
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
                const files = attachmentFiles
                    .filter((attachment) => !attachment.id)
                    .map((attachment) => attachment.file);
                if (files.length > 0) await UploadFiles(response.id || id, files);
            }

            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save task');
            navigate('/');
        }
    };

    const handleAddSubtask = () => {
        if (subtasks.length >= 10) {
            setSubTaskError('Maximum of 10 subtasks allowed');
            return;
        } else {
            setSubTaskError('');
        }
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

        if (subtasks.length <= 10) {
            setSubTaskError('');
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
                <Typography variant="h6" gutterBottom display={'flex'}>
                    <Typography
                        style={{ color: '#027CEC', marginRight: '4px', cursor: 'pointer', fontSize: '1.25rem' }}
                        onClick={() => navigate(-1)}
                    >
                        <img src={BackIcon} alt="Back" style={{ height: '12px', marginRight: '8px' }} />
                        Back
                    </Typography>{' '}
                    | {id ? 'View Task / Edit' : 'New Task'}
                </Typography>

                <CuztomizedPaper>
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
                                                label={<Typography variant="h6">Title</Typography>}
                                                name="title"
                                                value={task.title}
                                                onChange={handleInputChange}
                                                fullWidth
                                                margin="normal"
                                                multiline
                                                rows={4}
                                                disabled={!!id}
                                                inputProps={{ maxLength: 25 }}
                                                error={!!titleError}
                                                helperText={titleError}
                                                InputProps={{
                                                    style: {
                                                        fontSize: '1.25rem',
                                                        fontWeight: 500,
                                                    },
                                                }}
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
                                                inputProps={{ maxLength: 300 }}
                                                error={!!detailsError}
                                                helperText={detailsError}
                                            />
                                        </Grid>
                                    </Grid>
                                </form>

                                <AttachmentComponent
                                    onFilesChange={handleAttachmentFilesChange}
                                    attachments={attachmentData}
                                    maxFiles={5}
                                    maxFileSize={10 * 1024 * 1024}
                                    allowedFileTypes={['image/png', 'image/jpeg']}
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
                                            <CuztomizedImg src={NewSubtaskIconInactive} alt="Add Subtask" />
                                        ) : isAddSubtaskHovered ? (
                                            <CuztomizedImg src={NewSubtaskIconSelected} alt="Add Subtask" />
                                        ) : (
                                            <CuztomizedImg src={NewSubtaskIconActive} alt="Add Subtask" />
                                        )}
                                    </IconButton>
                                </Box>
                                {subTaskError && <Typography color="error">{subTaskError}</Typography>}

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
                </CuztomizedPaper>

                <Box display="flex" justifyContent="flex-end" marginTop="32px" marginRight="16px">
                    <IconButton onClick={() => navigate(-1)}>
                        <CuztomizedImg src={CancelButton} alt="Add Subtask" />
                    </IconButton>
                    {showMarkAsComplete && !isMarkAsComplete ? (
                        <IconButton onClick={handleMarkAsComplete}>
                            <CuztomizedImg src={MarkAsCompleteButton} alt="Mark as Complete" />
                        </IconButton>
                    ) : (
                        <IconButton onClick={handleSubmit}>
                            <CuztomizedImg src={SaveButton} alt="Add Subtask" />
                        </IconButton>
                    )}
                </Box>
            </FormContainer>
        </DashboardComponent>
    );
};

export default TaskPage;
