import { styled } from '@mui/material/styles';

export const RenderedContainer = styled('div')(() => ({
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: '1px solid #E0E0E0',
    '& .title': {
        margin: '20px 20%',
        fontWeight: 'bold',
    },
    '& .status': {
        width: '8%',
        margin: '20px 10%',
    },
}));

export const CuztomizedImg = styled('img')(() => ({
    height: '20px',
}));
