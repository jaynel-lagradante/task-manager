import { Box, styled } from '@mui/material';

export const SignOutModalBox = styled(Box)(() => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 280,
    bgcolor: 'background.paper',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: '16px 32px',
    '& > div:nth-of-type(1)': {
        textAlign: 'left',
        marginBottom: 12,
    },
    '& > div:nth-of-type(2)': {
        textAlign: 'left',
        marginBottom: 12,
    },
    '& > div:nth-of-type(3)': {
        display: 'flex',
        justifyContent: 'flex-end',
        '& > button:nth-of-type(1)': {
            marginRight: 10,
            minWidth: 0,
            textTransform: 'none',
            color: 'black',
        },
        '& > button:nth-of-type(2)': {
            minWidth: 0,
            textTransform: 'none',
            color: 'black',
        },
    },
}));

export const ModalComponentBox = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 300,
    backgroundColor: 'white',
    textAlign: 'center',
    borderRadius: theme.spacing(2),
    padding: '16px 32px',
    '& > img': {
        height: '60px',
        marginBottom: '16px',
    },
    '& .secondLabel': {
        textDecoration: 'underline',
    },
    '& .buttonContainer': {
        display: 'flex',
        justifyContent: 'center',
        marginTop: theme.spacing(2),

        '& > button > img': {
            height: '40px',
        },
    },
}));
