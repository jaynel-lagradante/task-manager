import { styled } from '@mui/material/styles';
import { Button, MenuItem } from '@mui/material';
import { TEMPLATE } from './TemplateStyles';

export const FilterButton = styled(Button)(({ theme }) => ({
    textTransform: 'none',
    fontSize: '16px',
    fontWeight: 400,
    color: '#000000',
    backgroundColor: TEMPLATE.COLOR.BACKGROUND,
    borderRadius: '8px',
    border: `1px solid ${TEMPLATE.COLOR.BORDER}`,
    '& .buttonLabel': {
        display: 'none',
    },
    padding: '8px',
    minWidth: '50px',

    // desktop view
    '@media (min-width: 900px)': {
        padding: '8px 16px',
        '& .buttonLabel': {
            display: 'block',
        },
    },
}));

export const FilterIconImg = styled('img')(({ theme }) => ({
    marginRight: '8px',
    height: '20px',
}));

export const CuztomizedMenuItem = styled(MenuItem)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '30px',
}));
