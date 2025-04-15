import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, Container, Box } from '@mui/material';

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography variant="h1" component="h2" gutterBottom color="error">
                    404
                </Typography>
                <Typography variant="h5" gutterBottom>
                    Page Not Found
                </Typography>
                <Typography variant="body1" align="center" color="textSecondary">
                    The page you are looking for does not exist. It might have been moved, deleted, or the URL might be
                    incorrect.
                </Typography>
                <Button variant="contained" color="primary" onClick={handleGoHome} sx={{ mt: 3 }}>
                    Go to Homepage
                </Button>
            </Box>
        </Container>
    );
};

export default NotFound;
