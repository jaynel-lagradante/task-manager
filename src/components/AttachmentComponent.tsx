import React, { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import NewSubtaskIconSelected from './../assets/Icons/Upload.svg';
import CancelIcon from './../assets/Icons/Cancel.svg';
import { Attachment } from '../types/AttachmentInterface';
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
    BrowseContainer,
    UploadImageIcon,
    CustomInput,
    CustomizedStack,
} from '../layouts/AttachmentStyles';
import ModalComponent from './ModalComponent';
import { MESSAGES } from '../constants/Messages';

interface AttachmentComponentProps {
    attachments: Attachment[];
    maxFiles?: number;
    maxFileSize?: number;
    allowedFileTypes?: string[];
    onFilesChange?: (files: Attachment[]) => void;
    onDelete?: (id: string[]) => void;
}

const AttachmentComponent: React.FC<AttachmentComponentProps> = ({
    attachments,
    maxFiles = 5,
    maxFileSize = 10 * 1024 * 1024, // 10 MB
    allowedFileTypes,
    onFilesChange,
    onDelete,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFiles, setSelectedFiles] = useState<Attachment[]>();
    const [objectURLs, setObjectURLs] = useState<string[]>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [fileToDelete, setFileToDelete] = useState<string[]>();
    const [modalProp, setModalProp] = useState({
        firstLabel: '',
        secondLabel: '',
        onCloseLabel: '',
        onConfirmLabel: '',
        onClose: () => {},
        onConfirm: () => {},
    });

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

    useEffect(() => {
        onDelete && onDelete(fileToDelete ?? []);
    }, [fileToDelete]);

    const handleBrowseClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleModalRemoveFile = (index: number, file: Attachment) => {
        setModalProp({
            firstLabel: MESSAGES.LABEL.REMOVE_FILE,
            secondLabel: `${file.file.name}`,
            onCloseLabel: MESSAGES.BUTTON.CANCEL,
            onConfirmLabel: MESSAGES.BUTTON.DELETE,
            onClose: () => setIsModalOpen(false),
            onConfirm: () => {
                handleRemoveFile(index, file?.id), setIsModalOpen(false);
            },
        });
        setIsModalOpen(true);
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
            setFileToDelete([...(fileToDelete ?? []), fileId]);
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

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const handleNewFiles = (newFilesList: File[]) => {
        const validFiles: Attachment[] = [];
        const newURLs: string[] = [];
        const totalFiles = newFilesList.length + (selectedFiles?.length || 0);
        let largeFilesLabel = '';
        let invalidTypeFilesLabel = '';
        const { MAX_FILE, ALLOWED_FILE, MAX_FILE_SIZE } = MESSAGES.IDENTIFIER;

        if (totalFiles > maxFiles) {
            setModalProp({
                firstLabel: MESSAGES.ERROR.MAXIMUM_FILE.replace(MAX_FILE, maxFiles.toString()),
                secondLabel: ``,
                onCloseLabel: MESSAGES.BUTTON.CLOSE,
                onConfirmLabel: '',
                onClose: () => setIsModalOpen(false),
                onConfirm: () => {},
            });
            setIsModalOpen(true);
            return;
        }

        newFilesList.forEach((file) => {
            if (maxFileSize && file.size > maxFileSize) {
                largeFilesLabel += `${file.name} `;
                return;
            }

            if (allowedFileTypes && allowedFileTypes.length > 0 && !allowedFileTypes.includes(file.type)) {
                invalidTypeFilesLabel += `${file.name} `;
                return;
            }

            validFiles.push({ file });
            if (file.type.startsWith('image/')) {
                newURLs.push(URL.createObjectURL(file));
            } else {
                newURLs.push('');
            }
        });

        if (invalidTypeFilesLabel) {
            setModalProp({
                firstLabel: invalidTypeFilesLabel,
                secondLabel: MESSAGES.ERROR.INVALID_FILE.replace(ALLOWED_FILE, allowedFileTypes?.join(', ') ?? ''),
                onCloseLabel: MESSAGES.BUTTON.CLOSE,
                onConfirmLabel: '',
                onClose: () => setIsModalOpen(false),
                onConfirm: () => {},
            });
            setIsModalOpen(true);
        }

        if (largeFilesLabel) {
            setModalProp({
                firstLabel: largeFilesLabel,
                secondLabel: MESSAGES.ERROR.EXCEED_FILE_SIZE.replace(MAX_FILE_SIZE, formatFileSize(maxFileSize)),
                onCloseLabel: MESSAGES.BUTTON.CLOSE,
                onConfirmLabel: '',
                onClose: () => setIsModalOpen(false),
                onConfirm: () => {},
            });
            setIsModalOpen(true);
        }

        setSelectedFiles((prevFiles) => [...(prevFiles || []), ...validFiles]);
        setObjectURLs((prevURLs) => [...(prevURLs || []), ...newURLs]);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <AttachmentBox onDrop={handleDrop} onDragOver={handleDragOver}>
            <LegendTypography variant="subtitle2">Attachments</LegendTypography>
            <Box>
                <CustomizedStack>
                    <UploadImageIcon src={NewSubtaskIconSelected} alt="Upload" />
                    <Typography variant="body2">
                        Drop files to attach, or <BrowseContainer onClick={handleBrowseClick}>browse</BrowseContainer>
                    </Typography>
                </CustomizedStack>
            </Box>

            <AttachmentBoxContent>
                {selectedFiles?.map((file, index) => (
                    <ImageBoxContainer key={index}>
                        {file.file.type.startsWith('image/') && objectURLs && objectURLs[index] && (
                            <FileDivContainer>
                                <CuztomizedImg src={objectURLs[index]} alt={file.file.name} />
                                <CuztomizedImgDiv>
                                    <Typography variant="body2">{file.file.name}</Typography>
                                    <Typography variant="subtitle2">{formatFileSize(file.file.size)}</Typography>
                                </CuztomizedImgDiv>
                            </FileDivContainer>
                        )}
                        <CuztomizedIconButton onClick={() => handleModalRemoveFile(index, file)} size="small">
                            <img src={CancelIcon} alt="Remove" />
                        </CuztomizedIconButton>
                    </ImageBoxContainer>
                ))}
            </AttachmentBoxContent>

            <CustomInput type="file" ref={fileInputRef} onChange={handleFileChange} multiple />

            <ModalComponent open={isModalOpen} {...modalProp} />
        </AttachmentBox>
    );
};

export default AttachmentComponent;
