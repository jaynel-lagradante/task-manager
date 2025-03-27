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
    IconButton,
    Grid,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import moment, { Moment } from 'moment';
import { Task } from '../types/TaskInterface';
import { CreateTask, GetTaskById, UpdateTask } from '../services/TaskService';
import { DeleteFiles, GetFiles, UploadFiles } from '../services/FileService';
import DashboardComponent from './../components/DashboardComponent';
import SubtaskComponent from './../components/SubTaskComponent';
import NewSubtaskIconSelected from './../assets/Buttons/Button_New Subtask_selected.svg';
import NewSubtaskIconActive from './../assets/Buttons/Button_New Subtask_active.svg';
import NewSubtaskIconInactive from './../assets/Buttons/Button_New Subtask_inactive.svg';
import {
    CuztomizedImg,
    CuztomizedPaper,
    CuztomizedTypography,
    FormContainer,
    CuztomizedDivider,
    SubtaskBox,
    ButtonBox,
} from '../layouts/TaskStyles';
import SaveButton from './../assets/Buttons/Button_Save.svg';
import CancelButton from './../assets/Buttons/Button_Cancel.svg';
import { createSubtasks, deleteSubtasks, getSubtasks, updateSubtasks } from '../services/SubtaskService';
import { Subtask } from '../types/SubTaskInterface';
import MarkAsCompleteButton from './../assets/Buttons/Button_Mark as Complete.svg';
import AttachmentComponent from './../components/AttachmentComponent';
import { Attachment } from '../types/AttachmentInterface';
import BackIcon from '../assets/Icons/Back.svg';
import { useTaskState } from '../state/TaskState';
import { STATUS } from '../constants/Status';
import { MESSAGES } from '../constants/Messages';

const TaskPage: React.FC = () => {
    const { COMPLETE, CANCELLED, NOT_STARTED, IN_PROGRESS } = STATUS.TASK;
    const { LOW, HIGH, CRITICAL } = STATUS.TASK_PRIORITY;
    const { DONE, NOT_DONE } = STATUS.SUBTASK;
    const {
        TITLE_LENGTH,
        DETAILS_LENGTH,
        GET_TASKS,
        DUE_DATE_LATER,
        REQUIRED_DUE_DATE,
        REQUIRED_TITLE,
        UPDATE_TASK,
        SUBTASK_LENGTH,
        DELETE_SUBTASK,
    } = MESSAGES.ERROR;
    const dateFormat = 'MM/DD/YYYY';
    const allowedFiles = ['image/png', 'image/jpeg'];

    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const [task, setTask] = useState<Task>({
        title: 'Task 01',
        due_date: null,
        priority: LOW,
        status: NOT_STARTED,
        description: '',
        subtasks: [],
        date_completed: null,
    });
    const [error, setError] = useState('');
    const [dateCreated] = useState(moment().startOf('day'));
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
    const [fileToDelete, setFileToDelete] = useState<string[]>([]);
    const [subTaskToDelete, setSubTaskToDelete] = useState<string[]>([]);
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
                    if (data.status === COMPLETE) {
                        setCompletionDate(moment(data.completion_date));
                    }
                } catch (err: any) {
                    setError(err.response?.data?.message || GET_TASKS);
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
                setTitleError(TITLE_LENGTH);
            }
        } else if (name === 'description') {
            if (detailsError) setDetailsError('');
            if (value.length > 300) {
                setDetailsError(DETAILS_LENGTH);
            }
        }
        setTask({ ...task, [name]: value });
    };

    const handleSelectChange = (e: any) => {
        const { name, value } = e.target;
        if (value === COMPLETE) {
            setCompletionDate(moment());
        } else if (task.status === COMPLETE) {
            setCompletionDate(null);
        }
        setTask({ ...task, [name]: value });
    };

    const handleDateChange = (date: Moment | null) => {
        if (date) {
            const dateTomorrow = moment().add(1, 'day').startOf('day');
            if (date.isBefore(dateTomorrow, 'day') && task.status !== COMPLETE) {
                setDueDateError(DUE_DATE_LATER);
            } else {
                setDueDateError('');
            }
        } else {
            setDueDateError(REQUIRED_DUE_DATE);
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
            setTitleError(REQUIRED_TITLE);
            hasError = true;
        } else if (task.title.length > 25) {
            setTitleError(TITLE_LENGTH);
            hasError = true;
        }

        if (task.description.length > 300) {
            setDetailsError(DETAILS_LENGTH);
            hasError = true;
        }

        const dateTomorrow = moment().add(1, 'day').startOf('day');
        if (!task.due_date) {
            setDueDateError(REQUIRED_DUE_DATE);
            hasError = true;
        } else if (task.due_date.isBefore(dateTomorrow, 'day') && task.status !== COMPLETE) {
            setDueDateError(DUE_DATE_LATER);
            hasError = true;
        }

        const newSubtaskTitleErrors = subtasks.map((subtask) => (!subtask.title.trim() ? REQUIRED_TITLE : ''));
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
                status: isMarkAsComplete ? COMPLETE : task.status,
                description: task.description,
                date_completed: completionDate,
                hasAttachment: !!(attachmentFiles.length > 0),
            };

            let response;
            if (id) {
                response = await UpdateTask(id, taskData);
                updateTaskInState({ ...taskData, id, subtasks });
            } else {
                response = await CreateTask(taskData);
                addTask({ ...taskData, id: response.id, subtasks });
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

            if (fileToDelete?.length > 0) {
                await DeleteFiles(fileToDelete);
                setFileToDelete([]);
            }

            if (subTaskToDelete?.length > 0) {
                await deleteSubtasks(subTaskToDelete);
                setSubTaskToDelete([]);
            }

            if (attachmentFiles && attachmentFiles.length > 0) {
                const files = attachmentFiles
                    .filter((attachment) => !attachment.id)
                    .map((attachment) => attachment.file);
                if (files.length > 0) await UploadFiles(response.id || id, files);
            }

            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || UPDATE_TASK);
            navigate('/');
        }
    };

    const handleAddSubtask = () => {
        if (subtasks.length >= 10) {
            setSubTaskError(SUBTASK_LENGTH);
            return;
        } else {
            setSubTaskError('');
        }
        setSubtasks([...subtasks, { title: '', status: NOT_DONE }]);
    };

    const handleSubtaskTitleChange = (index: number, title: string) => {
        setSubtasks(subtasks.map((subtask, i) => (i === index ? { ...subtask, title } : subtask)));

        const newErrors = [...subtaskTitleErrors];
        if (!title.trim()) {
            newErrors[index] = REQUIRED_TITLE;
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
                setSubTaskToDelete([...subTaskToDelete, subtaskId]);
                setSubtasks(subtasks.filter((subtask) => subtask?.id !== subtaskId));
            } catch (error) {
                console.error(DELETE_SUBTASK, error);
            }
        } else {
            setSubtasks(subtasks.filter((_, i) => i !== index));
        }

        if (subtasks.length <= 10) {
            setSubTaskError('');
        }
    };

    const disableCompleteStatus = () => {
        return (subtasks.length > 0 && subtasks.every((subtask) => subtask.status === DONE)) || subtasks.length === 0;
    };

    const handleMarkAsComplete = () => {
        setIsMarkAsComplete(true);
        setCompletionDate(moment());
        setTask({ ...task, status: COMPLETE });
    };

    const showMarkAsComplete =
        subtasks.length > 0 && subtasks.every((subtask) => subtask.status === DONE) && task.status !== COMPLETE;

    const handleAttachmentFilesChange = (files: Attachment[]) => {
        setAttachmentFiles(files);
    };

    const handleFileToDelete = (fileIds: string[]) => {
        setFileToDelete(fileIds);
    };

    return (
        <DashboardComponent>
            <FormContainer>
                <CuztomizedTypography variant="h6" gutterBottom>
                    <Typography className="backContainer" onClick={() => navigate(-1)}>
                        <img src={BackIcon} alt="Back" />
                        Back
                    </Typography>{' '}
                    |{' '}
                    {id ? (
                        <>
                            <Typography color="textSecondary" className="viewTaskLabel">
                                View Task /
                            </Typography>{' '}
                            Edit{' '}
                        </>
                    ) : (
                        'New Task'
                    )}
                </CuztomizedTypography>

                <CuztomizedPaper>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <Container className="mainContainer" maxWidth="md">
                            <Box className="formContainer">
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
                                                    <MenuItem value={LOW}>{LOW}</MenuItem>
                                                    <MenuItem value={HIGH}>{HIGH}</MenuItem>
                                                    <MenuItem value={CRITICAL}>{CRITICAL}</MenuItem>
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
                                                    <MenuItem value={NOT_STARTED}>{NOT_STARTED}</MenuItem>
                                                    <MenuItem value={IN_PROGRESS}>{IN_PROGRESS}</MenuItem>
                                                    <MenuItem value={COMPLETE} disabled={!disableCompleteStatus()}>
                                                        {COMPLETE}
                                                    </MenuItem>
                                                    <MenuItem value={CANCELLED}>{CANCELLED}</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        {task.status === COMPLETE && (
                                            <Grid item xs={12} sm={3}>
                                                <TextField
                                                    label="Completion Date"
                                                    value={completionDate ? completionDate.format(dateFormat) : ''}
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
                                                    sx: {
                                                        fontSize: '1.25rem',
                                                        fontWeight: 500,
                                                    },
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="Date Created"
                                                value={dateCreated.format(dateFormat)}
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
                                                format={dateFormat}
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
                                    onDelete={handleFileToDelete}
                                    attachments={attachmentData}
                                    maxFiles={5}
                                    maxFileSize={10 * 1024 * 1024}
                                    allowedFileTypes={allowedFiles}
                                />

                                <CuztomizedDivider />

                                <SubtaskBox>
                                    <Typography variant="h6" gutterBottom>
                                        Subtask
                                    </Typography>
                                    <IconButton
                                        onClick={handleAddSubtask}
                                        disabled={task.status === COMPLETE}
                                        onMouseEnter={() => setIsAddSubtaskHovered(true)}
                                        onMouseLeave={() => setIsAddSubtaskHovered(false)}
                                    >
                                        {task.status === COMPLETE ? (
                                            <CuztomizedImg src={NewSubtaskIconInactive} alt="Add Subtask" />
                                        ) : isAddSubtaskHovered ? (
                                            <CuztomizedImg src={NewSubtaskIconSelected} alt="Add Subtask" />
                                        ) : (
                                            <CuztomizedImg src={NewSubtaskIconActive} alt="Add Subtask" />
                                        )}
                                    </IconButton>
                                </SubtaskBox>
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
                                        disableStatus={!id}
                                    />
                                ))}
                            </Box>
                        </Container>
                    </LocalizationProvider>
                </CuztomizedPaper>

                <ButtonBox>
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
                </ButtonBox>
            </FormContainer>
        </DashboardComponent>
    );
};

export default TaskPage;
