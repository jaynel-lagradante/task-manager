import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Typography, Box, Paper, Chip, IconButton, Divider, List, ListItem, ListItemText } from '@mui/material';
import moment from 'moment';
import { GetTaskById, GetFiles } from '../services/TaskService';
import { getSubtasks } from '../services/SubtaskService';
import { Task } from '../types/TaskInterface';
import { Subtask } from '../types/SubTaskInterface';
import { Attachment } from '../types/AttachmentInterface';
import { FormContainer } from '../layouts/TaskStyles';
import DashboardComponent from './DashboardComponent';
import BackIcon from '../assets/Icons/Back.svg';

import LowPriorityIcon from './../assets/Icons/Low_table.svg';
import HighPriorityIcon from './../assets/Icons/High_table.svg';
import CriticalPriorityIcon from './../assets/Icons/Critical_table.svg';

import NotStartedIcon from './../assets/Icons/Not Started.svg';
import InProgressIcon from './../assets/Icons/In Progress.svg';
import CompleteIcon from './../assets/Icons/Complete.svg';
import CancelledIcon from './../assets/Icons/Cancelled.svg';

import DeleteIcon from './../assets/Icons/Delete_active.svg';
import EditIcon from './../assets/Icons/Edit.svg';

const ViewTaskComponent = () => {
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const [task, setTask] = useState<Task | null>(null);
    const [subtasks, setSubtasks] = useState<Subtask[]>([]);
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [error, setError] = useState('');
    const [objectURLs, setObjectURLs] = useState<string[]>();

    useEffect(() => {
        const fetchTaskDetails = async () => {
            if (!id) return;
            try {
                const taskData = await GetTaskById(id);
                const subtasksData = await getSubtasks(id);
                const attachmentsData = await GetFiles(id);

                setTask(taskData);
                setSubtasks(subtasksData || []);

                if (attachmentsData && attachmentsData.length > 0) {
                    const newFiles: Attachment[] = attachmentsData.map((attachment: any) => {
                        const buffer = attachment.file_data.data;
                        const fileName = attachment.file_name;
                        const file = bufferToFile(buffer, fileName);
                        return { id: attachment.id, file };
                    });

                    setAttachments(newFiles);
                    const urls = newFiles.map((file) =>
                        file.file.type.startsWith('image/') ? URL.createObjectURL(file.file) : ''
                    );
                    setObjectURLs(urls);
                }
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to fetch task');
            }
        };

        fetchTaskDetails();
    }, [id]);

    if (!task) {
        return error ? <Typography color="error">{error}</Typography> : <Typography>Loading...</Typography>;
    }

    const formatFileSize = (bytes: number, decimals = 2): string => {
        if (!bytes) return '0 Bytes';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    function bufferToFile(buffer: ArrayBuffer, fileName: string) {
        const uint8Array = new Uint8Array(buffer);
        const blob = new Blob([uint8Array], { type: 'image/jpeg' });
        return new File([blob], fileName, { type: blob.type });
    }

    const getPriorityIcon = (priority: string) => {
        switch (priority) {
            case 'Low':
                return <img src={LowPriorityIcon} alt="Low Priority" style={{ height: '20px' }} />;
            case 'High':
                return <img src={HighPriorityIcon} alt="High Priority" style={{ height: '20px' }} />;
            case 'Critical':
                return <img src={CriticalPriorityIcon} alt="Critical Priority" style={{ height: '20px' }} />;
            default:
                return null;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Not Started':
                return <img src={NotStartedIcon} alt="Not Started" style={{ height: '20px' }} />;
            case 'In Progress':
                return <img src={InProgressIcon} alt="In Progress" style={{ height: '20px' }} />;
            case 'Complete':
                return <img src={CompleteIcon} alt="Complete" style={{ height: '20px' }} />;
            case 'Cancelled':
                return <img src={CancelledIcon} alt="Cancelled" style={{ height: '20px' }} />;
            default:
                return null;
        }
    };

    return (
        <DashboardComponent>
            <FormContainer>
                <Typography variant="h6" gutterBottom>
                    <Link to="/" style={{ textDecoration: 'none', color: '#027CEC' }}>
                        <img src={BackIcon} alt="Back" style={{ height: '12px', marginRight: '8px' }} />
                        Home
                    </Link>{' '}
                    | View Task
                </Typography>
                <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Box display="flex" alignItems="center">
                            {getPriorityIcon(task.priority)}

                            <Box display="flex" alignItems="center" marginLeft={4}>
                                {getStatusIcon(task.status)}
                                <Typography variant="body2" marginLeft={1}>
                                    {task.status}{' '}
                                    {task.status === 'Complete'
                                        ? `- ${moment(task.date_completed).format('DD MMM YYYY')}`
                                        : ''}
                                </Typography>
                            </Box>
                        </Box>

                        <Box>
                            <IconButton aria-label="edit" onClick={() => navigate(`/edit-task/${id}`)}>
                                <img src={EditIcon} alt="Edit" style={{ height: '20px' }} />
                            </IconButton>
                            <IconButton aria-label="delete">
                                <img src={DeleteIcon} alt="Delete" style={{ height: '20px' }} />
                            </IconButton>
                        </Box>
                    </Box>

                    <Typography variant="h5" gutterBottom>
                        {task.title}
                    </Typography>

                    <Typography variant="body2" color="textSecondary">
                        {moment(task.due_date).format('DD MMM YYYY')} - {moment(task.due_date).format('DD MMM YYYY')}
                    </Typography>

                    <Typography variant="body1" paragraph>
                        {task.description}
                    </Typography>

                    {attachments?.length > 0 && (
                        <Box
                            mt={2}
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                gap: 2,
                                marginTop: 2,
                            }}
                        >
                            {attachments.map((file, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        padding: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        position: 'relative',
                                        gap: 1,
                                    }}
                                >
                                    {file.file?.type?.startsWith('image/') && objectURLs && objectURLs[index] && (
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <img
                                                src={objectURLs[index]}
                                                alt={file.file?.name}
                                                style={{
                                                    height: '80px',
                                                    width: 'auto',
                                                    objectFit: 'cover',
                                                }}
                                            />
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'left',
                                                    marginTop: 10,
                                                }}
                                            >
                                                <Typography variant="body2" align="left">
                                                    {file.file?.name}
                                                </Typography>
                                                <Typography
                                                    variant="subtitle2"
                                                    color="textSecondary"
                                                    align="left"
                                                    fontSize={12}
                                                >
                                                    {formatFileSize(file.file?.size)}
                                                </Typography>
                                            </div>
                                        </div>
                                    )}
                                </Box>
                            ))}
                        </Box>
                    )}

                    <Divider style={{ margin: '20px 0' }} />

                    <Typography variant="h6" gutterBottom>
                        Subtask
                    </Typography>

                    <List>
                        {subtasks.map((subtask) => (
                            <ListItem key={subtask.id} disableGutters>
                                <ListItemText primary={subtask.title} />
                                <Chip
                                    label={subtask.status}
                                    color={subtask.status === 'Done' ? 'primary' : 'default'}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            </FormContainer>
        </DashboardComponent>
    );
};

export default ViewTaskComponent;
