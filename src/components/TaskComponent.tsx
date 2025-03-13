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
import { CreateTask, GetTaskById, UpdateTask, UploadFiles } from '../services/TaskService';
import DashboardComponent from './DashboardComponent';
import SubtaskComponent from './SubTaskComponent';
import NewSubtaskIcon from './../assets/Buttons/Button_New Subtask_selected.svg';
import { FormContainer } from '../layouts/TaskStyles';
import SaveButton from './../assets/Buttons/Button_Save.svg';
import CancelButton from './../assets/Buttons/Button_Cancel.svg';
import { createSubtasks, deleteSubtask, getSubtasks, updateSubtasks } from '../services/SubtaskService';
import { Subtask } from '../types/SubTaskInterface';
// import Attachment from './Attachment';

const TaskComponent: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const [task, setTask] = useState<Task>({
        title: '',
        due_date: null,
        priority: 'Low',
        status: 'Not Started',
        description: '',
        subtasks: [],
        // attachments: null,
    });
    const [error, setError] = useState('');
    const [dateCreated] = useState(moment());
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
    const [subtasks, setSubtasks] = useState<Subtask[]>([]);

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
                    setTask({
                        ...data,
                        due_date: data.due_date ? moment(data.due_date) : null,
                    });
                    if (subtasksData) {
                        setSubtasks(subtasksData || []);
                    }
                } catch (err: any) {
                    setError(err.response?.data?.message || 'Failed to fetch task');
                    navigate('/login');
                }
            }
        };
        fetchTask();
    }, [id, navigate]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTask({ ...task, [name]: value });
    };

    const handleSelectChange = (e: any) => {
        const { name, value } = e.target;
        setTask({ ...task, [name]: value });
    };

    const handleDateChange = (date: Moment | null | undefined) => {
        setTask({ ...task, due_date: date });
    };

    // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setSelectedFiles(event.target.files);
    // };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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
                status: task.status,
                description: task.description,
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

            // File upload logic
            if (selectedFiles && selectedFiles.length > 0) {
                await UploadFiles(response.id || id || '', selectedFiles);
                setSelectedFiles(null);
            }

            // // File upload logic
            // if (selectedFiles && selectedFiles.length > 0) {
            //     const formData = new FormData();
            //     for (let i = 0; i < selectedFiles.length; i++) {
            //         formData.append('files', selectedFiles[i]);
            //     }
            //     await axios.post(`http://localhost:5000/files/${response.data.id || id}`, formData, {
            //         headers: {
            //             Authorization: `Bearer ${token}`,
            //             'Content-Type': 'multipart/form-data',
            //         },
            //     });
            //     setSelectedFiles(null);
            // }

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
                                                    <MenuItem value="Complete">Complete</MenuItem>
                                                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                label="Title"
                                                name="title"
                                                value={task.title}
                                                onChange={handleInputChange}
                                                fullWidth
                                                margin="normal"
                                                multiline
                                                rows={3}
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
                                                slotProps={{ textField: { fullWidth: true, margin: 'normal' } }}
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
                                                rows={3}
                                            />
                                        </Grid>
                                    </Grid>
                                </form>

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
                                    <IconButton onClick={handleAddSubtask}>
                                        <img src={NewSubtaskIcon} alt="Add Subtask" style={{ height: '40px' }} />
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

                    <IconButton onClick={handleSubmit}>
                        <img src={SaveButton} alt="Add Subtask" style={{ height: '40px' }} />
                    </IconButton>
                </Box>
            </FormContainer>
        </DashboardComponent>
    );
};

export default TaskComponent;
