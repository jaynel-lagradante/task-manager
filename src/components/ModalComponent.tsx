import React from 'react';
import { Modal, Box, Typography, IconButton } from '@mui/material';
import AlertIcon from './../assets/Icons/Alert.svg';
import DeleteButton from './../assets/Buttons/Button_Delete.svg';
import CancelButton from './../assets/Buttons/Button_Cancel.svg';
import CancelIcon from './../assets/Icons/Cancel.svg';

interface ModalComponentProps {
    open: boolean;
    onCloseLabel?: string | null;
    onConfirmLabel?: string | null;
    onClose: () => void;
    onConfirm: () => void;
    firstLabel: string | null;
    secondLabel: string | null;
}

const ModalComponent: React.FC<ModalComponentProps> = ({
    open,
    onCloseLabel,
    onConfirmLabel,
    onClose,
    onConfirm,
    firstLabel,
    secondLabel,
}) => {
    let closeIcon = null;
    switch (onCloseLabel) {
        case 'Cancel':
            closeIcon = CancelButton;
            break;
        case 'Close':
            closeIcon = CancelIcon;
            break;
    }
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
                    {firstLabel}
                </Typography>
                {secondLabel && (
                    <Typography variant="h6" component="h2" gutterBottom style={{ textDecoration: 'underline' }}>
                        {secondLabel}
                    </Typography>
                )}
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                    {closeIcon && (
                        <IconButton onClick={onClose}>
                            <img src={closeIcon} alt="Cancel" style={{ height: '40px' }} />
                        </IconButton>
                    )}
                    {onConfirmLabel && (
                        <IconButton onClick={onConfirm}>
                            <img src={DeleteButton} alt="Delete" style={{ height: '40px' }} />
                        </IconButton>
                    )}
                </Box>
            </Box>
        </Modal>
    );
};

export default ModalComponent;
