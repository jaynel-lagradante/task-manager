import { styled } from '@mui/material/styles';
import { Container } from '@mui/material';

export const FormContainer = styled(Container)(({ theme }) => ({
    height: '100%',
    padding: 0,
   '@media (min-width: 1200px)': {
        maxWidth: '100%',
    },
}));