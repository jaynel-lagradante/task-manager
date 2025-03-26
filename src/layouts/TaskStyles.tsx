import { styled } from '@mui/material/styles';
import { Box, Container, Divider, Paper, Typography } from '@mui/material';

export const FormContainer = styled(Container)(({ theme }) => ({
    height: '100%',
    '@media (min-width: 1200px)': {
        maxWidth: '100%',
    },
    '@media (min-width: 600px)': {
        padding: 0,
    },
}));

export const CuztomizedPaper = styled(Paper)(({ theme }) => ({
    overflowY: 'auto',
    maxHeight: 'calc(100vh - 200px)',
    height: '100%',
    boxShadow: 'none',
    '& .mainContainer': {
        paddingBottom: '16px',
    },
    '& .formContainer': {
        marginTop: theme.spacing(4),
    },
}));

export const CuztomizedImg = styled('img')(() => ({
    height: '40px',
}));

export const CuztomizedTypography = styled(Typography)(() => ({
    display: 'flex',
    '& .backContainer': {
        color: '#027CEC',
        marginRight: '4px',
        cursor: 'pointer',
        fontSize: '1.25rem',
    },
    '& img': {
        height: '12px',
        marginRight: '8px',
    },
    '& .viewTaskLabel': {
        fontSize: '1.25rem',
        marginLeft: 5,
        marginRight: 5,
    },
}));

export const CuztomizedDivider = styled(Divider)(() => ({
    width: '100%',
    marginTop: '32px',
}));

export const SubtaskBox = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
}));

export const ButtonBox = styled(Box)(() => ({
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '32px',
    marginRight: '16px',
}));
