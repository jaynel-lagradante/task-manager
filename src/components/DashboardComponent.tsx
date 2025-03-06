import React, { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Tab, Box, Divider, Avatar, Typography } from '@mui/material';
import { Logout } from './../services/AuthService';
import LogoHeader from './../assets/Logo Header.svg';
import AvatarIcon from './../assets/Icons/Avatar.svg';
import { CuztomzedContainer, MenuTabs } from '../layouts/DashboardStyles';

interface DashboardComponentProps {
    children: ReactNode;
}

const DashboardComponent: React.FC<DashboardComponentProps> = ({children}) => {
    const [value, setValue] = useState(0);
    const navigate = useNavigate();
    const username = "John Doe";

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const handleSignOut = async () => {
        await Logout();
        navigate('/login');
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
                    <MenuTabs
                        value={value}
                        onChange={handleChange}
                        orientation="vertical"
                        aria-label="dashboard tabs"
                    >
                        <Tab label="Home" />
                        <Tab label="Sign out" onClick={handleSignOut} />
                    </MenuTabs>
                </Box>
            </Grid>
            <Grid item xs={12} sm={10} style={{ padding: '16px'}}>
                <CuztomzedContainer>
                    {children}
                </CuztomzedContainer>
            </Grid>
        </Grid>
    );
};

export default DashboardComponent;