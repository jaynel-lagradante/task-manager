import React, { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tab, Box, Typography, Modal, Button } from '@mui/material';
import { Logout } from './../services/AuthService';
import LogoHeader from './../assets/Logo Header.svg';
import AvatarIcon from './../assets/Icons/Avatar.svg';
import {
    ChildGridContainer,
    CuztomizedAvatar,
    CuztomizedDivider,
    CuztomzedContainer,
    DesktopMenu,
    HeaderImgBox,
    HeaderImg,
    MainGridContainer,
    MenuDivContainer,
    MenuGridContainer,
    MenuTabs,
    MobileMenu,
    AvatarBox,
    MobileMenuBox,
} from '../layouts/DashboardStyles';
import HomeIcon from './../assets/Icons/Home.svg';
import SignoutIcon from './../assets/Icons/Signout.svg';
import LoadingScreen from './LoadingScreen';
import { selectIsLoading, useLoadingState } from '../state/LoadingState';
import { SignOutModalBox } from '../layouts/ModalStyles';

interface DashboardComponentProps {
    children: ReactNode;
}

const DashboardComponent: React.FC<DashboardComponentProps> = ({ children }) => {
    const [value, setValue] = useState(0);
    const navigate = useNavigate();
    const username = localStorage.getItem('username');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const isLoading = useLoadingState(selectIsLoading);

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
        <MainGridContainer container>
            <MenuGridContainer item xs={12} sm={12} md={2}>
                <DesktopMenu>
                    <HeaderImgBox>
                        <HeaderImg src={LogoHeader} alt="Logo" />
                    </HeaderImgBox>
                    <CuztomizedDivider />
                    <AvatarBox>
                        <CuztomizedAvatar src={AvatarIcon} alt="Avatar" />
                        <Typography variant="body1">{username}</Typography>
                    </AvatarBox>
                    <MenuTabs value={value} onChange={handleChange} orientation="vertical" aria-label="dashboard tabs">
                        <Tab
                            label={
                                <MenuDivContainer>
                                    <img src={HomeIcon} alt="Home" />
                                    <span>Home</span>
                                </MenuDivContainer>
                            }
                            onClick={() => navigate('/')}
                        />
                        <Tab
                            label={
                                <MenuDivContainer>
                                    <img src={SignoutIcon} alt="Sign out" />
                                    <span>Sign out</span>
                                </MenuDivContainer>
                            }
                            onClick={handleOpenModal}
                        />
                    </MenuTabs>
                </DesktopMenu>

                <MobileMenu>
                    <Box>
                        <HeaderImg src={LogoHeader} alt="Logo" />
                    </Box>
                    <MobileMenuBox>
                        <MenuTabs
                            value={value}
                            onChange={handleChange}
                            orientation="horizontal"
                            aria-label="dashboard tabs"
                        >
                            <Tab
                                label={
                                    <div>
                                        <img src={HomeIcon} alt="Home" />
                                    </div>
                                }
                                onClick={() => navigate('/')}
                            />
                            <Tab
                                label={
                                    <div>
                                        <img src={SignoutIcon} alt="Sign out" />
                                    </div>
                                }
                                onClick={handleOpenModal}
                            />
                        </MenuTabs>
                    </MobileMenuBox>
                </MobileMenu>
            </MenuGridContainer>
            <ChildGridContainer item xs={12} sm={12} md={10}>
                <LoadingScreen open={isLoading} />
                <CuztomzedContainer>{children}</CuztomzedContainer>
            </ChildGridContainer>
            <Modal open={isModalOpen} onClose={() => handleCloseModal(value)}>
                <SignOutModalBox>
                    <Box>
                        <Typography variant="h6" component="h2">
                            Sign out
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="body1">
                            Are you sure you want to sign out?
                            <br />
                            All unsaved changes will be lost.
                        </Typography>
                    </Box>
                    <Box>
                        <Button onClick={() => handleCloseModal(0)}>Cancel</Button>
                        <Button onClick={handleSignOutConfirm}>Sign out</Button>
                    </Box>
                </SignOutModalBox>
            </Modal>
        </MainGridContainer>
    );
};

export default DashboardComponent;
