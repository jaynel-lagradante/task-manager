import { styled } from '@mui/material/styles';
import { Container } from '@mui/material';

export const FormContainer = styled(Container)(({ theme }) => ({
    height: '100%',
    '@media (min-width: 1200px)': {
        maxWidth: '100%',
    },
    '@media (min-width: 600px)': {
        padding: 0,
    },
}));
