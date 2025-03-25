import { Box, styled } from '@mui/material';

export const ContainerBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(2),
    '& .titleInput': {
        flex: 2,
    },
    '& .selectStatus': {
        flex: 1,
    },
    '& .deleteIcon': { height: '20px' },
}));
