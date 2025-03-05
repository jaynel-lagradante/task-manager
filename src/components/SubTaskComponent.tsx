import React from 'react';
import { TextField, FormControl, Select, MenuItem, IconButton, Box } from '@mui/material';
import DeleteIcon from './../assets/Icons/Delete_active.svg';

interface SubtaskProps {
    index: number;
    title: string;
    status: string;
    onTitleChange: (index: number, title: string) => void;
    onStatusChange: (index: number, status: string) => void;
    onDelete: (index: number) => void;
}

const Subtask: React.FC<SubtaskProps> = ({ index, title, status, onTitleChange, onStatusChange, onDelete }) => {
    return (
        <Box display="flex" alignItems="center" gap={2} marginBottom={2}>
            <TextField
                label="Subtask Title"
                value={title}
                onChange={(e) => onTitleChange(index, e.target.value)}
                size="small"
                fullWidth // Make TextField full width
                sx={{ flex: 1 }} // Expand TextField
            />
            <FormControl size="small" sx={{ flex: 1 }}> 
                <Select
                    value={status}
                    onChange={(e) => onStatusChange(index, e.target.value)}
                >
                    <MenuItem value="Not Started">Not Started</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Complete">Complete</MenuItem>
                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                </Select>
            </FormControl>
            <IconButton onClick={() => onDelete(index)}>
                <img src={DeleteIcon} alt="Delete" style={{ height: '20px' }} />
            </IconButton>
        </Box>
    );
};

export default Subtask;