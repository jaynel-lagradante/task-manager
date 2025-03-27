import { styled } from '@mui/material/styles';
import { TEMPLATE } from './TemplateStyles';
import { Box } from '@mui/material';

export const RenderedContainer = styled('div')(() => ({
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: `1px solid ${TEMPLATE.COLOR.BORDER}`,
    gap: 2,
    '& .title': {
        margin: '20px 20%',
        fontWeight: 'bold',
    },
    '& .status': {
        width: '11%',
        margin: '20px 10%',
        display: 'flex',
        alignItems: 'center',
        '& img': {
            height: '10px',
            marginRight: '8px',
        },
    },
}));

export const CuztomizedImg = styled('img')(() => ({
    height: '20px',
}));

export const ExpandCustomizeBox = styled(Box)(() => ({
    display: 'flex',
    justifyContent: 'flex-end',
    '& .expand': {
        height: '6px',
    },
    '& .suppress': { height: '10px' },
}));

export const TitleContainer = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
    '& .title': {
        fontWeight: 'bold',
        textDecoration: 'underline',
        cursor: 'pointer',
    },
    '& img': {
        height: '20px',
        marginLeft: '8px',
    },
}));

export const PriorityImg = styled('img')(() => ({
    height: '20px',
}));

export const StatusContainer = styled('div')(() => ({
    display: 'flex',
    alignItems: 'center',
    '& img': {
        height: '20px',
        marginRight: '8px',
    },
}));

export const EditImg = styled('img')(() => ({
    height: '20px',
    cursor: 'pointer',
}));

export const SortContainer = styled('div')(() => ({
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    '& img': {
        height: '15px',
        marginLeft: '5px',
    },
}));
