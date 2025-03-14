import React, { useEffect, useRef, useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { IconButton, Stack } from '@mui/material';
import NewSubtaskIconSelected from './../assets/Icons/Upload.svg';
import CancelIcon from './../assets/Icons/Cancel.svg';
import { Attachment } from '../types/AttachmentInterface';
import { DeleteFile } from '../services/TaskService';

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

interface AttachmentComponentProps {
    attachments: Attachment[];
    onFilesChange?: (files: Attachment[]) => void;
}

const AttachmentComponent: React.FC<AttachmentComponentProps> = ({ attachments, onFilesChange }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFiles, setSelectedFiles] = useState<Attachment[]>();
    const [objectURLs, setObjectURLs] = useState<string[]>();

    useEffect(() => {
        if (attachments && attachments.length > 0) {
            const newFiles: Attachment[] = attachments.map((attachment: any) => {
                const buffer = attachment.file_data.data;
                const fileName = attachment.file_name;
                const file = bufferToFile(buffer, fileName);
                return { id: attachment.id, file };
            });

            setSelectedFiles(newFiles);
            const urls = newFiles.map((file) =>
                file.file.type.startsWith('image/') ? URL.createObjectURL(file.file) : ''
            );
            setObjectURLs(urls);
        }
    }, [attachments]);

    useEffect(() => {
        onFilesChange && onFilesChange(selectedFiles ?? []);
    }, [selectedFiles]);

    const handleBrowseClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const newURLs: string[] = [];
            const newFiles: Attachment[] = [];

            Array.from(files).forEach((file) => {
                newFiles.push({ file });
                if (file.type.startsWith('image/')) {
                    const url = URL.createObjectURL(file);
                    newURLs.push(url);
                } else {
                    newURLs.push('');
                }
            });

            setSelectedFiles((prevFiles) => {
                const currentFiles = prevFiles ?? [];
                const updatedFiles = [...currentFiles, ...newFiles];
                return updatedFiles;
            });

            setObjectURLs((prevURLs) => [...(prevURLs ?? []), ...newURLs]);
        }
    };

    const handleRemoveFile = async (index: number, fileId: string | undefined) => {
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
        if (fileId) {
            await DeleteFile(fileId);
        }
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        if (files) {
            const newURLs: string[] = [];
            const newFiles: Attachment[] = [];

            Array.from(files).forEach((file) => {
                newFiles.push({ file });
                if (file.type.startsWith('image/')) {
                    const url = URL.createObjectURL(file);
                    newURLs.push(url);
                } else {
                    newURLs.push('');
                }
            });

            setSelectedFiles((prevFiles) => {
                const currentFiles = prevFiles ?? [];
                const updatedFiles = [...currentFiles, ...newFiles];
                return updatedFiles;
            });

            setObjectURLs((prevURLs) => [...(prevURLs ?? []), ...newURLs]);
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const formatFileSize = (bytes: number, decimals = 2): string => {
        if (!bytes) return '0 Bytes';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    function bufferToFile(buffer: ArrayBuffer, fileName: string) {
        const uint8Array = new Uint8Array(buffer);
        const blob = new Blob([uint8Array], { type: 'image/jpeg' });
        return new File([blob], fileName, { type: blob.type });
    }

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
                            position: 'relative',
                            gap: 1,
                        }}
                    >
                        {file.file.type.startsWith('image/') && objectURLs && objectURLs[index] && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <img
                                    src={objectURLs[index]}
                                    alt={file.file.name}
                                    style={{
                                        height: '80px',
                                        width: 'auto',
                                        objectFit: 'cover',
                                    }}
                                />
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'left',
                                        marginTop: 10,
                                    }}
                                >
                                    <Typography variant="body2" align="left">
                                        {file.file.name}
                                    </Typography>
                                    <Typography variant="subtitle2" color="textSecondary" align="left" fontSize={12}>
                                        {formatFileSize(file.file.size)}
                                    </Typography>
                                </div>
                            </div>
                        )}
                        <IconButton
                            onClick={() => handleRemoveFile(index, file?.id)}
                            size="small"
                            sx={{
                                position: 'absolute',
                                top: -15,
                                right: 15,
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
