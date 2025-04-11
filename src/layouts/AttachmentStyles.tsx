import { Box, IconButton, Stack, styled, Typography } from '@mui/material';
import { TEMPLATE } from './TemplateStyles';

export const AttachmentBox = styled(Box)(({ theme }) => ({
    position: 'relative',
    border: `1px dashed ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(3),
    textAlign: 'center',
    marginTop: theme.spacing(2),
    '& .fileUploadProgress': {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        '& .fileUploadProgressContainer': {
            textAlign: 'left',
            minWidth: '400px',
        },
    },
}));

export const LegendTypography = styled(Typography)(({ theme }) => ({
    position: 'absolute',
    top: theme.spacing(-1),
    left: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(0, 1),
    color: TEMPLATE.COLOR.SECONDARY,
}));

export const AttachmentBoxContent = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing(10),
    marginTop: theme.spacing(2),
}));

export const ImageBoxContainer = styled(Box)(() => ({
    padding: 1,
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    gap: 1,
}));

export const CuztomizedImg = styled('img')(() => ({
    // desktop view
    '@media (min-width: 900px)': {
        height: '80px',
        width: 'auto',
    },
    maxWidth: '100%',
    width: 'auto',
    objectFit: 'cover',
}));

export const CuztomizedImgDiv = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left',
    marginTop: theme.spacing(1.5),
    textAlign: 'left',
    '& h6': {
        fontSize: '12px',
        color: TEMPLATE.COLOR.SECONDARY,
    },
}));

export const CuztomizedIconButton = styled(IconButton)(({ theme }) => ({
    position: 'absolute',
    // desktop view
    '@media (min-width: 900px)': {
        top: theme.spacing(-2.5),
        right: 5,
    },
    maxWidth: '100%',
    top: theme.spacing(-2.5),
    right: theme.spacing(-2.5),
    '& img': {
        height: 15,
    },
}));

export const FileDivContainer = styled('div')(() => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
}));

export const BrowseContainer = styled('span')(() => ({
    cursor: 'pointer',
    color: TEMPLATE.COLOR.PRIMARY,
}));

export const UploadImageIcon = styled('img')(() => ({
    height: '25px',
}));

export const CustomInput = styled('input')(() => ({
    display: 'none',
}));

export const CustomizedStack = styled(Stack)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    spacing: theme.spacing(1),
    marginTop: theme.spacing(2),
}));
