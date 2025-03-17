import React, { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';
import NewSubtaskIconSelected from './../assets/Icons/Upload.svg';
import CancelIcon from './../assets/Icons/Cancel.svg';
import { Attachment } from '../types/AttachmentInterface';
import { DeleteFile } from '../services/TaskService';
import { formatFileSize } from '../utils/TextHelper';
import { bufferToFile } from '../utils/FileHelper';
import {
    AttachmentBox,
    AttachmentBoxContent,
    LegendTypography,
    ImageBoxContainer,
    CuztomizedImg,
    CuztomizedImgDiv,
    CuztomizedIconButton,
    FileDivContainer,
} from '../layouts/AttachmentStyles';

interface AttachmentComponentProps {
    attachments: Attachment[];
    maxFiles?: number;
    maxFileSize?: number;
    onFilesChange?: (files: Attachment[]) => void;
}

const AttachmentComponent: React.FC<AttachmentComponentProps> = ({
    attachments,
    maxFiles,
    maxFileSize,
    onFilesChange,
}) => {
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

    // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const files = event.target.files;
    //     if (files) {
    //         const newURLs: string[] = [];
    //         const newFiles: Attachment[] = [];

    //         Array.from(files).forEach((file) => {
    //             newFiles.push({ file });
    //             if (file.type.startsWith('image/')) {
    //                 const url = URL.createObjectURL(file);
    //                 newURLs.push(url);
    //             } else {
    //                 newURLs.push('');
    //             }
    //         });

    //         setSelectedFiles((prevFiles) => {
    //             const currentFiles = prevFiles ?? [];
    //             const updatedFiles = [...currentFiles, ...newFiles];
    //             return updatedFiles;
    //         });

    //         setObjectURLs((prevURLs) => [...(prevURLs ?? []), ...newURLs]);
    //     }
    // };

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

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            handleNewFiles(Array.from(files));
        }
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        if (files) {
            handleNewFiles(Array.from(files));
        }
    };

    // const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    //     event.preventDefault();
    //     const files = event.dataTransfer.files;
    //     if (files) {
    //         const newURLs: string[] = [];
    //         const newFiles: Attachment[] = [];

    //         Array.from(files).forEach((file) => {
    //             newFiles.push({ file });
    //             if (file.type.startsWith('image/')) {
    //                 const url = URL.createObjectURL(file);
    //                 newURLs.push(url);
    //             } else {
    //                 newURLs.push('');
    //             }
    //         });

    //         setSelectedFiles((prevFiles) => {
    //             const currentFiles = prevFiles ?? [];
    //             const updatedFiles = [...currentFiles, ...newFiles];
    //             return updatedFiles;
    //         });

    //         setObjectURLs((prevURLs) => [...(prevURLs ?? []), ...newURLs]);
    //     }
    // };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const handleNewFiles = (newFilesList: File[]) => {
        const validFiles: Attachment[] = [];
        const newURLs: string[] = [];

        newFilesList.forEach((file) => {
            if (maxFiles && selectedFiles && selectedFiles.length >= maxFiles) {
                console.log(`Maximum of ${maxFiles} files allowed.`, { variant: 'warning' });
                return;
            }

            if (maxFileSize && file.size > maxFileSize) {
                console.log(`File "${file.name}" exceeds the maximum size of ${formatFileSize(maxFileSize)}.`, {
                    variant: 'warning',
                });
                return;
            }

            validFiles.push({ file });
            if (file.type.startsWith('image/')) {
                newURLs.push(URL.createObjectURL(file));
            } else {
                newURLs.push('');
            }
        });

        setSelectedFiles((prevFiles) => [...(prevFiles || []), ...validFiles]);
        setObjectURLs((prevURLs) => [...(prevURLs || []), ...newURLs]);

        // Clear the input value so the same file can be selected again
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
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

            <AttachmentBoxContent>
                {selectedFiles?.map((file, index) => (
                    <ImageBoxContainer key={index}>
                        {file.file.type.startsWith('image/') && objectURLs && objectURLs[index] && (
                            <FileDivContainer>
                                <CuztomizedImg src={objectURLs[index]} alt={file.file.name} />
                                <CuztomizedImgDiv>
                                    <Typography variant="body2" align="left">
                                        {file.file.name}
                                    </Typography>
                                    <Typography variant="subtitle2" color="textSecondary" align="left" fontSize={12}>
                                        {formatFileSize(file.file.size)}
                                    </Typography>
                                </CuztomizedImgDiv>
                            </FileDivContainer>
                        )}
                        <CuztomizedIconButton onClick={() => handleRemoveFile(index, file?.id)} size="small">
                            <img src={CancelIcon} alt="Remove" style={{ height: '15px' }} />
                        </CuztomizedIconButton>
                    </ImageBoxContainer>
                ))}
            </AttachmentBoxContent>

            <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} multiple />
        </AttachmentBox>
    );
};

export default AttachmentComponent;
