import React, { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Tab, Box, Divider, Avatar, Typography, Modal, Button } from '@mui/material';
import { Logout } from './../services/AuthService';
import LogoHeader from './../assets/Logo Header.svg';
import AvatarIcon from './../assets/Icons/Avatar.svg';
import { CuztomzedContainer, MenuTabs } from '../layouts/DashboardStyles';
import HomeIcon from './../assets/Icons/Home.svg';
import SignoutIcon from './../assets/Icons/Signout.svg';

interface DashboardComponentProps {
    children: ReactNode;
}

const DashboardComponent: React.FC<DashboardComponentProps> = ({ children }) => {
    const [value, setValue] = useState(0);
    const navigate = useNavigate();
    const username = localStorage.getItem('username');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = (newValue: number) => {
        setIsModalOpen(false);
        setValue(newValue);
    };

    const handleSignOutConfirm = async () => {
        await Logout();
        navigate('/login');
        setIsModalOpen(false);
    };

    return (
        <Grid container style={{ height: '100vh' }}>
            <Grid item xs={12} sm={2} style={{ backgroundColor: '#fffff', padding: '16px' }}>
                <Box display="flex" flexDirection="column">
                    <Box display="flex" justifyContent="flex-start" width="100%" marginBottom="16px">
                        <img src={LogoHeader} alt="Logo" style={{ height: '60px' }} />
                    </Box>
                    <Divider style={{ width: '100%', marginBottom: '16px' }} />
                    <Box display="flex" flexDirection="column" alignItems="center" width="100%" marginBottom="16px">
                        <Avatar src={AvatarIcon} alt="Avatar" style={{ marginBottom: '8px' }} />
                        <Typography variant="body1">{username}</Typography>
                    </Box>
                    <MenuTabs value={value} onChange={handleChange} orientation="vertical" aria-label="dashboard tabs">
                        <Tab
                            label={
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        width: '100%',
                                    }}
                                >
                                    <img src={HomeIcon} alt="Home" style={{ height: '20px' }} />
                                    <span style={{ textAlign: 'center', flex: 1 }}>Home</span>
                                </div>
                            }
                        />
                        <Tab
                            label={
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        width: '100%',
                                    }}
                                >
                                    <img src={SignoutIcon} alt="Sign out" style={{ height: '20px' }} />
                                    <span style={{ textAlign: 'center', flex: 1 }}>Sign out</span>
                                </div>
                            }
                            onClick={handleOpenModal}
                        />
                    </MenuTabs>
                </Box>
            </Grid>
            <Grid item xs={12} sm={10} style={{ padding: '16px' }}>
                <CuztomzedContainer>{children}</CuztomzedContainer>
            </Grid>
            <Modal open={isModalOpen} onClose={() => handleCloseModal(value)}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 280,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                        padding: '16px 32px',
                    }}
                >
                    <Box sx={{ textAlign: 'left', mb: 2 }}>
                        <Typography variant="h6" component="h2">
                            Sign out
                        </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'left', mb: 2 }}>
                        <Typography variant="body1">
                            Are you sure you want to sign out?
                            <br />
                            All unsaved changes will be lost.
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            onClick={() => handleCloseModal(0)}
                            sx={{ mr: 2, minWidth: 0, textTransform: 'none', color: 'black' }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSignOutConfirm}
                            sx={{ minWidth: 0, textTransform: 'none', color: 'black' }}
                        >
                            Sign out
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Grid>
    );
};

export default DashboardComponent;
