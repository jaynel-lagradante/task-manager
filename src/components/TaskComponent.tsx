import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {
    TextField,
    Button,
    Container,
    Typography,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Divider,
    IconButton,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import moment, { Moment } from 'moment';
import { Task } from '../types/TaskInterface';
import { CreateTask, UpdateTask, UploadFiles } from '../services/TaskService';
import DashboardComponent from './DashboardComponent';
import Subtask from './SubTaskComponent';
import NewSubtaskIcon from './../assets/Buttons/Button_New Subtask_selected.svg'; 
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
        // attachments: null,
    });
    const [error, setError] = useState('');
    const [dateCreated] = useState(moment());
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
    const [subtasks, setSubtasks] = useState<{ title: string; status: string }[]>([]);

    useEffect(() => {
        const fetchTask = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            if (id) {
                try {
                    const response = await axios.get(`http://localhost:5000/tasks/${id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setTask({
                        ...response.data,
                        due_date: response.data.due_date ? moment(response.data.due_date) : null,
                    });
                    setSubtasks(response.data.subtasks || []);
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
                // subtasks,
            };

            let response;
            if (id) {
                response = await UpdateTask(id, taskData);
            } else {
                response = await CreateTask(taskData);
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
        setSubtasks([...subtasks, { title: '', status: 'Not Started' }]);
    };

    const handleSubtaskTitleChange = (index: number, title: string) => {
        setSubtasks(subtasks.map((subtask, i) => i === index ? { ...subtask, title } : subtask));
    };

    const handleSubtaskStatusChange = (index: number, status: string) => {
        setSubtasks(subtasks.map((subtask, i) => i === index ? { ...subtask, status } : subtask));
    };

    const handleDeleteSubtask = (index: number) => {
        setSubtasks(subtasks.filter((_, i) => i !== index));
    };


    return (
        <DashboardComponent>
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <Container maxWidth="md">
                    <Box mt={4}>
                        <Typography variant="h4" gutterBottom>
                            {id ? 'Edit Task' : 'Create Task'}
                        </Typography>
                        {error && <Typography color="error">{error}</Typography>}
                        <form onSubmit={handleSubmit}>
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
                            <TextField
                                label="Date Created"
                                value={dateCreated.format('YYYY-MM-DD')}
                                fullWidth
                                margin="normal"
                                disabled
                            />
                            <DatePicker
                                label="Due Date"
                                value={task.due_date}
                                onChange={(date) => handleDateChange(date)}
                                slotProps={{ textField: { fullWidth: true, margin: 'normal' } }}
                            />
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
                            {/* <FormControl fullWidth margin="normal">
                                <InputLabel htmlFor="attachment-input">Attachment</InputLabel>
                                <Input id="attachment-input" type="file" onChange={handleFileChange} />
                                {task.attachments && <FormHelperText>Selected file: {task.attachments.name}</FormHelperText>}
                            </FormControl> */}
                            {/* <FormControl fullWidth margin="normal">
                                <InputLabel htmlFor="attachment-input">Attachment</InputLabel>
                                <Input id="attachment-input" type="file" onChange={handleFileChange} />
                                {selectedFiles && <FormHelperText>Selected {selectedFiles.length} files</FormHelperText>}
                            </FormControl> */}
                            {/* { id && <Attachment taskId={id}></Attachment> }  */}
                            
                        </form>

                        <Divider style={{ width: '100%', marginTop: '32px' }} />
                        
                        <Box mt={2} display="flex" justifyContent="space-between" alignItems="center" style={{ marginBottom: '16px', marginTop: '4px' }}>
                            <Typography variant="h6" gutterBottom>Subtask</Typography>
                            {/* <Button onClick={handleAddSubtask} variant="outlined">
                                Add Subtask
                            </Button> */}
                            <IconButton onClick={handleAddSubtask}>
                                <img src={NewSubtaskIcon} alt="Add Subtask" style={{ height: '40px' }} />
                            </IconButton>
                        </Box>
                        
                        {subtasks.map((subtask, index) => (
                            <Subtask
                                key={index}
                                index={index}
                                title={subtask.title}
                                status={subtask.status}
                                onTitleChange={handleSubtaskTitleChange}
                                onStatusChange={handleSubtaskStatusChange}
                                onDelete={handleDeleteSubtask}
                            />
                        ))}
                    </Box>
                    <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '16px' }}>
                        Save
                    </Button>
                </Container>
            </LocalizationProvider>
        </DashboardComponent>
    );
};

export default TaskComponent;