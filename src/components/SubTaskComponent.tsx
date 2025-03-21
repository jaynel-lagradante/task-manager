import React, { useState } from 'react';
import { TextField, FormControl, Select, MenuItem, IconButton, Box, InputLabel } from '@mui/material';
import DeleteIcon from './../assets/Icons/Delete_active.svg';
import { Subtask } from '../types/SubTaskInterface';
import ModalComponent from './ModalComponent';

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

    const handleDeleteSelected = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <Box display="flex" alignItems="flex-start" gap={2} marginBottom={2}>
            <TextField
                label="Title"
                value={subtask.title}
                onChange={(e) => onTitleChange(index, e.target.value)}
                size="small"
                fullWidth
                sx={{ flex: 2 }}
                error={!!titleError}
                helperText={titleError}
            />
            <FormControl size="small" sx={{ flex: 1 }}>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                    labelId="status-label"
                    value={subtask.status}
                    label="Status"
                    onChange={(e) => onStatusChange(index, e.target.value)}
                    disabled={disableStatus}
                >
                    <MenuItem value="Not Done">Not Done</MenuItem>
                    <MenuItem value="Done">Done</MenuItem>
                </Select>
            </FormControl>
            <IconButton onClick={() => handleDeleteSelected()}>
                <img src={DeleteIcon} alt="Delete" style={{ height: '20px' }} />
            </IconButton>

            <ModalComponent
                open={isModalOpen}
                onCloseLabel={'Cancel'}
                onConfirmLabel={'Delete'}
                onClose={handleCloseModal}
                onConfirm={() => {
                    onDelete(index), handleCloseModal();
                }}
                firstLabel={'Delete this Subtask?'}
                secondLabel={subtask.title}
            />
        </Box>
    );
};

export default SubtaskComponent;
