import { styled } from '@mui/material/styles';
import { Box, IconButton } from '@mui/material';

export const TableContainer = styled('div')(({ theme }) => ({
    width: '100%',
    marginTop: '20px',
    borderRadius: '16px',
    backgroundColor: 'white',
    overflowX: 'auto',
    maxHeight: '70vh',
    '& .MuiDataGrid-root': {
        borderRadius: '16px',
    },
}));

export const FilterIconImg = styled('img')(({ theme }) => ({
    height: '30px',
    marginRight: '5px',
    cursor: 'pointer',
    margin: theme.spacing(0.5),
}));

export const FilterContainerBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: '8px 24px',
    borderRadius: '16px',
    border: '1px solid #E0E0E0',
    marginTop: theme.spacing(2),
    '& .filterContainer': {
        display: 'flex',
        alignItems: 'center',
        '& .filterIconContainer': {
            display: 'flex',
            flexWrap: 'wrap',
            marginLeft: theme.spacing(1),
        },
    },
}));

export const CuztomizedIconButton = styled(IconButton)(() => ({
    padding: '0px',
    '& img': {
        height: '45px',
    },
    '& .newTask': {
        display: 'none',
    },
    '& .newTaskMobile': {
        display: 'block',
    },
    // desktop view
    '@media (min-width: 900px)': {
        '& .newTask': {
            display: 'block',
        },
        '& .newTaskMobile': {
            display: 'none',
        },
    },
}));
