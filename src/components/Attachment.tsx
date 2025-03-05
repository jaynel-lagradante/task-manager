// src/components/Attachment.tsx
import React, { useState, useEffect } from 'react';
import { Typography, List, ListItem, ListItemText } from '@mui/material';
// import { getFiles } from '../services/taskService';
import { GetFiles } from '../services/TaskService';

interface AttachmentProps {
    taskId: string;
}

const Attachment: React.FC<AttachmentProps> = ({ taskId }) => {
    const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

    useEffect(() => {
        const fetchFiles = async () => {
            if (!taskId) return;
            try {
                const files = await GetFiles(taskId);
                setUploadedFiles(files.map((file: any) => file.file_name));
            } catch (error) {
                console.error("Error fetching files", error);
            }
        };
        fetchFiles();
    }, [taskId]);

    return (
        <div>
            {uploadedFiles.length > 0 && (
                <div>
                    <Typography variant="subtitle1" style={{ marginTop: '16px' }}>Uploaded Files:</Typography>
                    <List>
                        {uploadedFiles.map((fileName, index) => (
                            <ListItem key={index}>
                                <ListItemText primary={fileName} />
                            </ListItem>
                        ))}
                    </List>
                </div>
            )}
        </div>
    );
};

export default Attachment;