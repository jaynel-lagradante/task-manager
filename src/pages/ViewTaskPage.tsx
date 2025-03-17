import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Typography, Box, IconButton, Grid, Container } from '@mui/material';
import moment from 'moment';
import { GetTaskById, GetFiles, DeleteTask } from '../services/TaskService';
import { getSubtasks } from '../services/SubtaskService';
import { Task } from '../types/TaskInterface';
import { Subtask } from '../types/SubTaskInterface';
import { Attachment } from '../types/AttachmentInterface';
import { FormContainer } from '../layouts/TaskStyles';
import DashboardComponent from './../components/DashboardComponent';
import BackIcon from '../assets/Icons/Back.svg';
import DeleteConfirmationModal from './../components/DeleteConfirmationModalComponent';
import LowPriorityIcon from './../assets/Icons/Low_table.svg';
import HighPriorityIcon from './../assets/Icons/High_table.svg';
import CriticalPriorityIcon from './../assets/Icons/Critical_table.svg';
import NotStartedIcon from './../assets/Icons/Not Started.svg';
import InProgressIcon from './../assets/Icons/In Progress.svg';
import CompleteIcon from './../assets/Icons/Complete.svg';
import CancelledIcon from './../assets/Icons/Cancelled.svg';
import DeleteIcon from './../assets/Icons/Delete_active.svg';
import EditIcon from './../assets/Icons/Edit.svg';
import DoneIcon from './../assets/Icons/Done.svg';
import NotDoneIcon from './../assets/Icons/Not Done.svg';
import { formatFileSize } from '../utils/TextHelper';
import { bufferToFile } from '../utils/FileHelper';
import {
    AttachmentBoxContainer,
    AttachmentBoxContent,
    CuztomizedDivider,
    CuztomizedPaper,
    FileContainer,
} from '../layouts/ViewTaskStyles';

const ViewTaskComponent = () => {
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const [task, setTask] = useState<Task | null>(null);
    const [subtasks, setSubtasks] = useState<Subtask[]>([]);
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [error, setError] = useState('');
    const [objectURLs, setObjectURLs] = useState<string[]>();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDeleteSelected = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

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
                navigate('/');
            }
        };

        fetchTaskDetails();
    }, [id]);

    if (!task) {
        return error ? <Typography color="error">{error}</Typography> : <Typography>Loading...</Typography>;
    }

    const getPriorityIcon = (priority: string) => {
        switch (priority) {
            case 'Low':
                return LowPriorityIcon;
            case 'High':
                return HighPriorityIcon;
            case 'Critical':
                return CriticalPriorityIcon;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Not Started':
                return NotStartedIcon;
            case 'In Progress':
                return InProgressIcon;
            case 'Complete':
                return CompleteIcon;
            case 'Cancelled':
                return CancelledIcon;
        }
    };

    const handleConfirmDelete = async () => {
        try {
            task.id && (await DeleteTask(task.id));
            setIsModalOpen(false);
            navigate('/');
        } catch (error) {
            console.error('Error deleting selected tasks:', error);
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
                <CuztomizedPaper elevation={3}>
                    <Container>
                        <Box mt={4}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Box display="flex" alignItems="center">
                                    <img
                                        src={getPriorityIcon(task.priority)}
                                        alt={task.priority}
                                        style={{ height: '20px' }}
                                    />
                                    <Box display="flex" alignItems="center" marginLeft={4}>
                                        <img
                                            src={getStatusIcon(task.status)}
                                            alt={task.status}
                                            style={{ height: '20px' }}
                                        />
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
                                    <IconButton aria-label="delete" onClick={() => handleDeleteSelected()}>
                                        <img src={DeleteIcon} alt="Delete" style={{ height: '20px' }} />
                                    </IconButton>
                                </Box>
                            </Box>

                            <Typography variant="h5">{task.title}</Typography>

                            <Typography variant="body2" color="textSecondary">
                                {moment(task.due_date).format('DD MMM YYYY')} -{' '}
                                {moment(task.due_date).format('DD MMM YYYY')}
                            </Typography>

                            <Typography variant="body1" paragraph mt={2}>
                                {task.description}
                            </Typography>

                            {attachments?.length > 0 && (
                                <AttachmentBoxContainer mt={2}>
                                    {attachments.map((file, index) => (
                                        <AttachmentBoxContent key={index}>
                                            {file.file?.type?.startsWith('image/') &&
                                                objectURLs &&
                                                objectURLs[index] && (
                                                    <FileContainer>
                                                        <img src={objectURLs[index]} alt={file.file?.name} />
                                                        <div>
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
                                                    </FileContainer>
                                                )}
                                        </AttachmentBoxContent>
                                    ))}
                                </AttachmentBoxContainer>
                            )}

                            <CuztomizedDivider />

                            <Typography variant="h6" gutterBottom>
                                Subtask
                            </Typography>

                            {subtasks.map((subtask) => {
                                let statusIcon = null;
                                if (subtask.status === 'Done') {
                                    statusIcon = DoneIcon;
                                } else if (subtask.status === 'Not Done') {
                                    statusIcon = NotDoneIcon;
                                }
                                return (
                                    <Grid container marginTop={1} key={`${subtask.id}`}>
                                        <Grid sm={3} xs={7}>
                                            <Typography variant="body1" color="textPrimary">
                                                {subtask.title}
                                            </Typography>
                                        </Grid>
                                        <Grid sm={3} xs={5}>
                                            <Typography variant="body1" color="textSecondary">
                                                {statusIcon && (
                                                    <img
                                                        src={statusIcon}
                                                        alt={subtask.status}
                                                        style={{ height: '10px', marginRight: '8px' }}
                                                    />
                                                )}
                                                {subtask.status}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                );
                            })}
                        </Box>
                    </Container>
                </CuztomizedPaper>
            </FormContainer>

            <DeleteConfirmationModal
                open={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={() => handleConfirmDelete()}
                firstLabel={'Delete this Task?'}
                secondLabel={task.title}
            />
        </DashboardComponent>
    );
};

export default ViewTaskComponent;
