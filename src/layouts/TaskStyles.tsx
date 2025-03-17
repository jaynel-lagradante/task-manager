import { styled } from '@mui/material/styles';
import { Container, Paper } from '@mui/material';

export const FormContainer = styled(Container)(({ theme }) => ({
    height: '100%',
    '@media (min-width: 1200px)': {
        maxWidth: '100%',
    },
    '@media (min-width: 600px)': {
        padding: 0,
    },
}));

export const CuztomizedPaper = styled(Paper)(() => ({
    overflowY: 'auto',
    maxHeight: 'calc(100vh - 200px)',
    height: '100%',
    boxShadow: 'none',
}));

export const CuztomizedImg = styled('img')(() => ({
    height: '40px',
}));
