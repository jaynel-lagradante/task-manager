import { Box, IconButton, styled, Typography } from '@mui/material';

export const AttachmentBox = styled(Box)(({ theme }) => ({
    position: 'relative',
    border: `1px dashed ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(3),
    textAlign: 'center',
}));

export const LegendTypography = styled(Typography)(({ theme }) => ({
    position: 'absolute',
    top: theme.spacing(-1),
    left: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(0, 1),
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
    height: '80px',
    width: 'auto',
    objectFit: 'cover',
}));

export const CuztomizedImgDiv = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left',
    marginTop: theme.spacing(1.5),
}));

export const CuztomizedIconButton = styled(IconButton)(({ theme }) => ({
    position: 'absolute',
    top: theme.spacing(-2.5),
    right: 5,
}));

export const FileDivContainer = styled('div')(() => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
}));
