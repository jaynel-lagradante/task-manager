import { Box, Divider, Paper, styled } from '@mui/material';

export const CuztomizedPaper = styled(Paper)(({ theme }) => ({
    overflowY: 'auto',
    maxHeight: 'calc(100vh - 110px)',
    height: '100%',
    boxShadow: 'none',
    borderRadius: '8px',
    paddingBottom: '20px',
    // desktop view
    '@media (min-width: 900px)': {
        paddingBottom: '0px',
    },
    '& .priorityContainer': {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing(2),
        '& img': {
            height: '20px',
        },

        '& .iconContainer': {
            display: 'flex',
            alignItems: 'center',
            '& div': {
                display: 'flex',
                alignItems: 'center',
                marginLeft: theme.spacing(4),
                '& p': {
                    marginLeft: theme.spacing(1),
                },
            },
        },
    },
    '& .fileSizeLabel': {
        height: '10px',
        marginRight: '8px',
    },
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
        // desktop view
        '@media (min-width: 900px)': {
            height: '80px',
            width: 'auto',
        },
        maxWidth: '100%',
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

export const CustomizedTypography = styled(Divider)(({ theme }) => ({
    color: '#027CEC',
    marginRight: '4px',
    cursor: 'pointer',
    fontSize: '1.25rem',
    '& img': {
        height: '12px',
        marginRight: '8px',
    },
}));
