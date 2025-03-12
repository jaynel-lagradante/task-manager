import { styled } from '@mui/material/styles';
import { Grid, Button, Typography, Divider, ListItem } from '@mui/material';

export const GridContainer = styled(Grid)(({ theme }) => ({
    minHeight: '100vh',
    width: '100vw',
    margin: 0,
}));

export const ImageGridItem = styled(Grid)(({ theme }) => ({
    padding: '20px',
    textAlign: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
}));

export const ImageLogoItem = styled('img')(({ theme }) => ({
    maxWidth: '100%',
    height: 'auto',
}));

export const FormGridItem = styled(Grid)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: theme.spacing(10),
}));

export const SubmitButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(4),
    textTransform: 'none',
}));

export const SignupMessageItem = styled(Grid)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
}));

export const SignupLink = styled(Typography)(({ theme }) => ({
    color: 'blue',
    cursor: 'pointer',
    textDecoration: 'underline',
}));

export const SigninOptionButton = styled(Button)(({ theme }) => ({
    color: 'black',
    border: '1px solid rgba(0, 0, 0, 0.12)',
    marginTop: theme.spacing(1),
    textTransform: 'none',
}));

export const OrDivider = styled(Divider)(({ theme }) => ({
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    '&::before, &::after': {
        borderTop: `1px solid ${theme.palette.divider}`,
    },
    '& .MuiDivider-wrapper': {
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
        backgroundColor: 'white',
    },
}));

export const IconWrapper = styled('span')(({ theme }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    marginRight: theme.spacing(1),
    '& img': {
        height: '20px',
    },
}));

export const PasswordChecklist = styled(ListItem)(({ theme }) => ({
    paddingTop: '0px',
    paddingBottom: '0px',
    '& .MuiListItemIcon-root': {
        minWidth: '30px',
    },
}));

export const PasswordListIconImg = styled('img')(({ theme }) => ({
    height: '10px',
}));
