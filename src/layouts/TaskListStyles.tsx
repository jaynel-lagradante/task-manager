import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const TableContainer = styled('div')(({ theme }) => ({
    width: '100%',
    marginTop: '20px',
    borderRadius: '16px',
    backgroundColor: 'white',
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
}));
