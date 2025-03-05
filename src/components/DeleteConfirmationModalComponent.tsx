import React from 'react';
import { Modal, Box, Typography, IconButton } from '@mui/material';
import AlertIcon from './../assets/Icons/Alert.svg'; 
import DeleteIcon from './../assets/Buttons/Button_Delete.svg';
import CancelIcon from './../assets/Buttons/Button_Cancel.svg';


interface DeleteConfirmationModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    count: number;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ open, onClose, onConfirm, count }) => {
    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 300,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    textAlign: 'center',
                    borderRadius: 2,
                    padding: '16px 32px',
                }}
            >
                <img src={AlertIcon} alt="Alert" style={{ height: '60px', marginBottom: '16px' }} />
                <Typography variant="h6" component="h2" gutterBottom>
                    {`${count} Task${count !== 1 ? 's' : ''} will be deleted.`}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center'}}>
                    <IconButton onClick={onClose}>
                        <img src={CancelIcon} alt="Cancel" style={{ height: '40px' }} />
                    </IconButton>
                    <IconButton onClick={onConfirm}>
                        <img src={DeleteIcon} alt="Delete" style={{ height: '40px' }} />
                    </IconButton>
                </Box>
            </Box>
        </Modal>
    );
};

export default DeleteConfirmationModal;