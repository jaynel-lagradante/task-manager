import { styled } from '@mui/material/styles';
import { Badge, Box, Container, Grid, Tabs } from '@mui/material';

export const DesktopMenu = styled(Grid)(() => ({
    '@media (max-width: 899px)': {
        display: 'none',
    },
    height: '100%',
}));

export const MobileMenu = styled(Grid)(() => ({
    '@media (min-width: 900px)': {
        display: 'none',
    },
}));

export const MainGridContainer = styled(Grid)(() => ({
    height: '100vh',
}));

export const MenuGridContainer = styled(Grid)(() => ({
    backgroundColor: '#fffff',
    padding: '16px',
}));

export const CuztomizedDivider = styled('div')(() => ({
    width: '100%',
    marginBottom: '16px',
}));

export const MenuDivContainer = styled('div')(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    '& img': {
        height: '20px',
    },
    '& span': {
        textAlign: 'center',
        flex: 1,
    },
}));

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

export const DeleteButtonBadge = styled(Badge)(() => ({
    '& .MuiBadge-badge': {
        right: -3,
        top: 18,
        padding: '0 4px',
        backgroundColor: '#62C6FF',
        color: '#fff',
    },
}));

export const CuztomizedHeaderBox = styled(Box)(() => ({
    width: 53,
    border: '1px solid #E0E0E0',
    borderRadius: 10,
}));

export const CuztomzedContainer = styled(Container)(() => ({
    padding: '16px',
    backgroundColor: '#F2F8FD',
    borderRadius: '16px',
    height: '100%',
    '@media (min-width: 1200px)': {
        maxWidth: '100%',
    },
}));
