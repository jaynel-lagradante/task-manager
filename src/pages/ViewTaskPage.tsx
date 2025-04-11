import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Typography, Box, IconButton, Grid, Container } from '@mui/material';
import moment from 'moment';
import { GetTaskById, DeleteTask } from '../services/TaskService';
import { GetFiles } from '../services/FileService';
import { getSubtasks } from '../services/SubtaskService';
import { Task } from '../types/TaskInterface';
import { Subtask } from '../types/SubTaskInterface';
import { Attachment } from '../types/AttachmentInterface';
import { FormContainer } from '../layouts/TaskStyles';
import DashboardComponent from './../components/DashboardComponent';
import BackIcon from '../assets/Icons/Back.svg';
import ModalComponent from '../components/ModalComponent';
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
    CustomizedTypography,
    CuztomizedDivider,
    CuztomizedPaper,
    FileContainer,
} from '../layouts/ViewTaskStyles';
import { useTaskState } from '../state/TaskState';
import { STATUS } from '../constants/Status';
import { MESSAGES } from '../constants/Messages';
import { ROUTES } from '../constants/Routes';

const ViewTaskComponent = () => {
    const { COMPLETE, CANCELLED, NOT_STARTED, IN_PROGRESS } = STATUS.TASK;
    const { LOW, HIGH, CRITICAL } = STATUS.TASK_PRIORITY;
    const { DONE, NOT_DONE } = STATUS.SUBTASK;
    const { DELETE_TASK } = MESSAGES.ERROR;
    const { CANCEL, DELETE } = MESSAGES.BUTTON;
    const dateFormat = 'DD MMM YYYY';
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const [task, setTask] = useState<Task | null>(null);
    const [subtasks, setSubtasks] = useState<Subtask[]>([]);
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [objectURLs, setObjectURLs] = useState<string[]>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { deleteTaskFromState } = useTaskState();

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
                navigate('/');
            }
        };

        fetchTaskDetails();
    }, [id]);

    const getPriorityIcon = (priority: string) => {
        switch (priority) {
            case LOW:
                return LowPriorityIcon;
            case HIGH:
                return HighPriorityIcon;
            case CRITICAL:
                return CriticalPriorityIcon;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case NOT_STARTED:
                return NotStartedIcon;
            case IN_PROGRESS:
                return InProgressIcon;
            case COMPLETE:
                return CompleteIcon;
            case CANCELLED:
                return CancelledIcon;
        }
    };

    const handleConfirmDelete = async () => {
        if (!task) return;
        try {
            if (task.id) {
                await DeleteTask(task.id);
                deleteTaskFromState(task.id);
            }
            setIsModalOpen(false);
            navigate('/');
        } catch (error) {
            console.error(DELETE_TASK, error);
        }
    };

    return (
        <DashboardComponent>
            {task && (
                <FormContainer>
                    <Typography className="backContainer" variant="h6" gutterBottom display={'flex'}>
                        <CustomizedTypography onClick={() => navigate(-1)}>
                            <img src={BackIcon} alt="Back" />
                            Back
                        </CustomizedTypography>{' '}
                        | View Task
                    </Typography>
                    <CuztomizedPaper elevation={3}>
                        <Container>
                            <Box mt={4}>
                                <Box className="priorityContainer">
                                    <Box className="iconContainer">
                                        <img src={getPriorityIcon(task.priority)} alt={task.priority} />
                                        <Box>
                                            <img src={getStatusIcon(task.status)} alt={task.status} />
                                            <Typography variant="body2">
                                                {task.status}{' '}
                                                {task.status === COMPLETE
                                                    ? `- ${moment(task.date_completed).format(dateFormat)}`
                                                    : ''}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box>
                                        <IconButton
                                            aria-label="edit"
                                            onClick={() => navigate(`${ROUTES.EDIT_TASK}/${id}`)}
                                        >
                                            <img src={EditIcon} alt="Edit" />
                                        </IconButton>
                                        <IconButton aria-label="delete" onClick={() => handleDeleteSelected()}>
                                            <img src={DeleteIcon} alt="Delete" />
                                        </IconButton>
                                    </Box>
                                </Box>

                                <Typography variant="h5">{task.title}</Typography>

                                <Typography variant="body2" color="textSecondary">
                                    {moment(task.created_at).format(dateFormat)} -{' '}
                                    {moment(task.due_date).format(dateFormat)}
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
                                                                <Typography
                                                                    className="fileName"
                                                                    variant="body2"
                                                                    align="left"
                                                                >
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
                                    if (subtask.status === DONE) {
                                        statusIcon = DoneIcon;
                                    } else if (subtask.status === NOT_DONE) {
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
                                                            className="fileSizeLabel"
                                                            src={statusIcon}
                                                            alt={subtask.status}
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
                    <ModalComponent
                        open={isModalOpen}
                        onCloseLabel={CANCEL}
                        onConfirmLabel={DELETE}
                        onClose={handleCloseModal}
                        onConfirm={() => handleConfirmDelete()}
                        firstLabel={MESSAGES.TASK.DELETE_TASK}
                        secondLabel={task.title}
                    />
                </FormContainer>
            )}
        </DashboardComponent>
    );
};

export default ViewTaskComponent;
