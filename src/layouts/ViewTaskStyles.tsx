import { Box, Divider, Paper, styled } from '@mui/material';

export const CuztomizedPaper = styled(Paper)(() => ({
    overflowY: 'auto',
    maxHeight: 'calc(100vh - 110px)',
    height: '100%',
    boxShadow: 'none',
    borderRadius: '8px',
}));

export const AttachmentBoxContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing(10),
    marginTop: 2,
}));

export const AttachmentBoxContent = styled(Box)(({ theme }) => ({
    padding: 1,
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    gap: 1,
}));

export const FileContainer = styled('div')(() => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& img': {
        height: '80px',
        width: 'auto',
        objectFit: 'cover',
    },
    '& div': {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'left',
        marginTop: 10,
    },
}));

export const CuztomizedDivider = styled(Divider)(({ theme }) => ({
    margin: '20px 0',
}));
