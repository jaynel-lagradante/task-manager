import { styled } from '@mui/material/styles';
import { Tabs } from '@mui/material';

// export const GridContainer = styled(Grid)(({ theme }) => ({
//     minHeight: '100vh',
//     width: '100vw',
//     margin: 0,
// }));

export const MenuTabs = styled(Tabs)(({ theme }) => ({
    '& .MuiTabs-flexContainer button': {
        // minWidth: 'auto',
        // padding: '6px 16px',
        // margin: '0 8px',
        textTransform: 'none',
    },
}));