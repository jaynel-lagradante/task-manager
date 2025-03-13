import React, { useEffect, useRef, useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { IconButton, Stack } from '@mui/material';
import NewSubtaskIconSelected from './../assets/Icons/Upload.svg';
import CancelIcon from './../assets/Icons/Cancel.svg';

const AttachmentBox = styled(Box)(({ theme }) => ({
    position: 'relative',
    border: `1px dashed ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(3),
    textAlign: 'center',
}));

const LegendTypography = styled(Typography)(({ theme }) => ({
    position: 'absolute',
    top: theme.spacing(-1),
    left: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(0, 1),
}));

const AttachmentComponent: React.FC = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFiles, setSelectedFiles] = useState<File[]>();
    const [objectURLs, setObjectURLs] = useState<string[]>();
    const handleBrowseClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const newURLs: string[] = [];
            const newFiles: File[] = [];

            Array.from(files).forEach((file) => {
                newFiles.push(file);
                if (file.type.startsWith('image/')) {
                    const url = URL.createObjectURL(file);
                    newURLs.push(url);
                } else {
                    newURLs.push(''); // Placeholder for non-images
                }
            });

            setSelectedFiles((prevFiles) => {
                const currentFiles = prevFiles ?? [];
                return [...currentFiles, ...newFiles];
            });

            setObjectURLs((prevURLs) => [...(prevURLs ?? []), ...newURLs]);
        }
    };

    const handleRemoveFile = (index: number) => {
        setSelectedFiles((prevFiles) => {
            const updatedFiles = prevFiles?.filter((_, i) => i !== index) ?? [];
            return updatedFiles;
        });

        setObjectURLs((prevURLs) => {
            if (prevURLs && prevURLs[index]) {
                URL.revokeObjectURL(prevURLs[index]);
            }

            const updatedURLs = prevURLs?.filter((_, i) => i !== index) ?? [];
            return updatedURLs;
        });
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        if (files) {
            const newURLs: string[] = [];
            const newFiles: File[] = [];

            Array.from(files).forEach((file) => {
                newFiles.push(file);
                if (file.type.startsWith('image/')) {
                    const url = URL.createObjectURL(file);
                    newURLs.push(url);
                } else {
                    newURLs.push('');
                }
            });

            console.log(files);

            setSelectedFiles((prevFiles) => {
                const currentFiles = prevFiles ?? [];
                return [...currentFiles, ...newFiles];
            });

            setObjectURLs((prevURLs) => [...(prevURLs ?? []), ...newURLs]);
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    useEffect(() => {
        return () => {
            if (objectURLs)
                objectURLs.forEach((url) => {
                    if (url) {
                        URL.revokeObjectURL(url);
                    }
                });
        };
    }, [objectURLs]);

    const formatFileSize = (bytes: number, decimals = 2): string => {
        if (!bytes) return '0 Bytes';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    return (
        <AttachmentBox marginTop={2} onDrop={handleDrop} onDragOver={handleDragOver}>
            <LegendTypography variant="subtitle2" color="textSecondary">
                Attachments
            </LegendTypography>
            <Box>
                <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} marginTop={2}>
                    <img src={NewSubtaskIconSelected} alt="Upload" style={{ height: '25px' }} />
                    <Typography variant="body2">
                        Drop files to attach, or{' '}
                        <Typography
                            component="span"
                            color="primary"
                            style={{ cursor: 'pointer' }}
                            onClick={handleBrowseClick}
                        >
                            browse
                        </Typography>
                    </Typography>
                </Stack>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: 2,
                    marginTop: 2,
                }}
            >
                {selectedFiles?.map((file, index) => (
                    <Box
                        key={index}
                        sx={{
                            padding: 1,
                            display: 'flex',
                            alignItems: 'center',
                            position: 'relative', // Crucial for absolute positioning
                        }}
                    >
                        {file.type.startsWith('image/') && objectURLs && objectURLs[index] && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <img
                                    src={objectURLs[index]}
                                    alt={file.name}
                                    style={{
                                        height: '50px',
                                        width: '50px',
                                        objectFit: 'cover',
                                    }}
                                />
                                <Typography variant="body2">{file.name}</Typography>
                                <Typography variant="body2">{formatFileSize(file.size)}</Typography>
                            </div>
                        )}
                        <IconButton
                            onClick={() => handleRemoveFile(index)}
                            size="small"
                            sx={{
                                position: 'absolute',
                                top: -15,
                                right: 0,
                            }}
                        >
                            <img src={CancelIcon} alt="Remove" style={{ height: '15px' }} />
                        </IconButton>
                    </Box>
                ))}
            </Box>

            <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} multiple />
        </AttachmentBox>
    );
};

export default AttachmentComponent;
