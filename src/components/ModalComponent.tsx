import React from 'react';
import { Modal, Box, Typography, IconButton } from '@mui/material';
import AlertIcon from './../assets/Icons/Alert.svg';
import DeleteButton from './../assets/Buttons/Button_Delete.svg';
import CancelButton from './../assets/Buttons/Button_Cancel.svg';
import CancelIcon from './../assets/Icons/Cancel.svg';
import { ModalComponentBox } from '../layouts/ModalStyles';
import { MESSAGES } from '../constants/Messages';

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
        case MESSAGES.BUTTON.CANCEL:
            closeIcon = CancelButton;
            break;
        case MESSAGES.BUTTON.CLOSE:
            closeIcon = CancelIcon;
            break;
    }
    return (
        <Modal open={open} onClose={onClose}>
            <ModalComponentBox>
                <img src={AlertIcon} alt="Alert" />
                <Typography variant="h6" component="h2" gutterBottom>
                    {firstLabel}
                </Typography>
                {secondLabel && (
                    <Typography variant="h6" component="h2" gutterBottom className="secondLabel">
                        {secondLabel}
                    </Typography>
                )}
                <Box className="buttonContainer">
                    {closeIcon && (
                        <IconButton onClick={onClose}>
                            <img src={closeIcon} alt="Cancel" />
                        </IconButton>
                    )}
                    {onConfirmLabel && (
                        <IconButton onClick={onConfirm}>
                            <img src={DeleteButton} alt="Delete" />
                        </IconButton>
                    )}
                </Box>
            </ModalComponentBox>
        </Modal>
    );
};

export default ModalComponent;
