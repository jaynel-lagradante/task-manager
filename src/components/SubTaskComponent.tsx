import React, { useState } from 'react';
import { TextField, FormControl, Select, MenuItem, IconButton, Box } from '@mui/material';
import DeleteIcon from './../assets/Icons/Delete_active.svg';
import { Subtask } from '../types/SubTaskInterface';
import DeleteConfirmationModal from './DeleteConfirmationModalComponent';

interface SubtaskProps {
    index: number;
    subtask: Subtask;
    onTitleChange: (index: number, title: string) => void;
    onStatusChange: (index: number, status: string) => void;
    onDelete: (index: number) => void;
    titleError?: string;
}

const SubtaskComponent: React.FC<SubtaskProps> = ({
    index,
    subtask,
    onTitleChange,
    onStatusChange,
    onDelete,
    titleError,
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
                label="Subtask Title"
                value={subtask.title}
                onChange={(e) => onTitleChange(index, e.target.value)}
                size="small"
                fullWidth
                sx={{ flex: 1 }}
                error={!!titleError}
                helperText={titleError}
            />
            <FormControl size="small" sx={{ flex: 1 }}>
                <Select value={subtask.status} onChange={(e) => onStatusChange(index, e.target.value)}>
                    <MenuItem value="Not Done">Not Done</MenuItem>
                    <MenuItem value="Done">Done</MenuItem>
                </Select>
            </FormControl>
            <IconButton onClick={() => handleDeleteSelected()}>
                <img src={DeleteIcon} alt="Delete" style={{ height: '20px' }} />
            </IconButton>

            <DeleteConfirmationModal
                open={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={() => onDelete(index)}
                firstLabel={'Delete this Subtask?'}
                secondLabel={subtask.title}
            />
        </Box>
    );
};

export default SubtaskComponent;
