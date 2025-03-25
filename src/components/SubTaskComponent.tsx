import React, { useState } from 'react';
import { TextField, FormControl, Select, MenuItem, IconButton, Box, InputLabel } from '@mui/material';
import DeleteIcon from './../assets/Icons/Delete_active.svg';
import { Subtask } from '../types/SubTaskInterface';
import ModalComponent from './ModalComponent';
import { ContainerBox } from '../layouts/SubTaskStyles';
import { MESSAGES } from '../constants/Messages';
import { STATUS } from '../constants/Status';

interface SubtaskProps {
    index: number;
    subtask: Subtask;
    onTitleChange: (index: number, title: string) => void;
    onStatusChange: (index: number, status: string) => void;
    onDelete: (index: number) => void;
    titleError?: string;
    disableStatus?: boolean;
}

const SubtaskComponent: React.FC<SubtaskProps> = ({
    index,
    subtask,
    onTitleChange,
    onStatusChange,
    onDelete,
    titleError,
    disableStatus = false,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { DONE, NOT_DONE } = STATUS.SUBTASK;

    const handleDeleteSelected = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <ContainerBox>
            <TextField
                label="Title"
                value={subtask.title}
                onChange={(e) => onTitleChange(index, e.target.value)}
                size="small"
                className="titleInput"
                fullWidth
                error={!!titleError}
                helperText={titleError}
            />
            <FormControl size="small" className="selectStatus">
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                    labelId="status-label"
                    value={subtask.status}
                    label="Status"
                    onChange={(e) => onStatusChange(index, e.target.value)}
                    disabled={disableStatus}
                >
                    <MenuItem value={NOT_DONE}>{NOT_DONE}</MenuItem>
                    <MenuItem value={DONE}>{DONE}</MenuItem>
                </Select>
            </FormControl>
            <IconButton onClick={() => handleDeleteSelected()}>
                <img src={DeleteIcon} className="deleteIcon" alt="Delete" />
            </IconButton>

            <ModalComponent
                open={isModalOpen}
                onCloseLabel={MESSAGES.BUTTON.CANCEL}
                onConfirmLabel={MESSAGES.BUTTON.DELETE}
                onClose={handleCloseModal}
                onConfirm={() => {
                    onDelete(index), handleCloseModal();
                }}
                firstLabel={MESSAGES.SUBTASK.DELETE_SUBTASK}
                secondLabel={subtask.title}
            />
        </ContainerBox>
    );
};

export default SubtaskComponent;
