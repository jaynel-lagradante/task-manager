import { styled } from '@mui/material/styles';
import { Badge, Box, Container, Tabs } from '@mui/material';

export const MenuTabs = styled(Tabs)(({ theme }) => ({
    '& .MuiTabs-indicator': {
        display: 'none',
    },
    '& .MuiTabs-flexContainer button': {
        textTransform: 'none',
    },
    '& .MuiTab-root': {
        justifyContent: 'flex-start',
        padding: '12px 16px',
        '&.Mui-selected': {
            backgroundColor: '#F2F8FD',
            color: theme.palette.text.primary,
            borderRadius: 10,
        },
    },
}));

export const DeleteButtonBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        right: -3,
        top: 18,
        padding: '0 4px',
        backgroundColor: '#62C6FF',
        color: '#fff',
    },
}));

export const CuztomizedHeaderBox = styled(Box)(({ theme }) => ({
    width: 53,
    border: '1px solid #E0E0E0',
    borderRadius: 10,
}));

export const CuztomzedContainer = styled(Container)(({ theme }) => ({
    padding: '16px',
    backgroundColor: '#F2F8FD',
    borderRadius: '16px',
    height: '100%',
    '@media (min-width: 1200px)': {
        maxWidth: '100%',
    },
}));
