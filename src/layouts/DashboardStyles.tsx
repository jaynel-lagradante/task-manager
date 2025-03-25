import { styled } from '@mui/material/styles';
import { Avatar, Badge, Box, Container, Divider, Grid, Tabs } from '@mui/material';
import { TEMPLATE } from './TemplateStyles';

export const DesktopMenu = styled(Grid)(() => ({
    display: 'none',
    height: '100%',
    // desktop view
    '@media (min-width: 900px)': {
        display: 'flex',
        flexDirection: 'column',
    },
}));

export const MobileMenu = styled(Grid)(() => ({
    display: 'flex',
    justifyContent: 'space-between',
    // desktop view
    '@media (min-width: 900px)': {
        display: 'none',
    },
}));

export const MobileMenuBox = styled(Box)(() => ({
    display: 'flex',
    flexDirection: 'row',
}));

export const MainGridContainer = styled(Grid)(() => ({
    // desktop view
    '@media (min-width: 900px)': {
        height: '100vh',
    },
    height: 'auto',
}));

export const MenuGridContainer = styled(Grid)(() => ({
    backgroundColor: '#fffff',
    padding: '16px',
}));

export const CuztomizedDivider = styled(Divider)(() => ({
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
            backgroundColor: TEMPLATE.COLOR.BACKGROUND,
            color: theme.palette.text.primary,
            borderRadius: 10,
        },
    },
}));

export const DeleteButtonBadge = styled(Badge)(() => ({
    '& .MuiBadge-badge': {
        right: -3,
        top: 16,
        padding: '0 4px',
        backgroundColor: TEMPLATE.COLOR.BADGE,
        color: '#fff',
    },
}));

export const CuztomizedHeaderBox = styled(Box)(() => ({
    width: 53,
    border: `1px solid ${TEMPLATE.COLOR.BORDER}`,
    borderRadius: 10,
}));

export const CuztomzedContainer = styled(Container)(() => ({
    padding: '16px',
    backgroundColor: TEMPLATE.COLOR.BACKGROUND,
    borderRadius: '16px',
    height: 'auto',
    // desktop view
    '@media (min-width: 900px)': {
        height: '95vh',
    },
    '@media (min-width: 1200px)': {
        maxWidth: '100%',
    },
}));

export const ChildGridContainer = styled(Grid)(() => ({
    padding: '16px',
}));

export const HeaderImgBox = styled(Box)(() => ({
    display: 'flex',
    justifyContent: 'flex-start',
    width: '100%',
    marginBottom: '16px',
}));

export const HeaderImg = styled('img')(() => ({
    height: '60px',
}));

export const AvatarBox = styled(Box)(() => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    marginBottom: '16px',
}));

export const CuztomizedAvatar = styled(Avatar)(() => ({
    marginBottom: '8px',
}));
