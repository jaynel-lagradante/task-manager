export const MESSAGES = {
    ERROR: {
        NETWORK: 'Network error. Please try again.',
        UNAUTHORIZED: 'Unauthorized or Forbidden! Logging out...',
        GET_SUBTASKS: 'Error fetching subtasks:',
        CREATE_SUBTASK: 'Error creating subtasks:',
        UPDATE_SUBTASK: 'Error updating subtasks:',
        DELETE_SUBTASK: 'Error deleting subtask:',
        GET_TASKS: 'Error fetching tasks:',
        CREATE_TASK: 'Error creating task:',
        UPDATE_TASK: 'Error updating task:',
        DELETE_TASK: 'Error deleting task:',
        GET_FILE: 'Error fetching file/s',
        UPLOAD_FILE: 'Error uploading file',
        DELETE_FILE: 'Error deleting file',
        LOGIN: 'Error logging in',
        REGISTER: 'Error registering account',
        MAXIMUM_FILE: 'Maximum of {maxFiles} files allowed.',
        INVALID_FILE: 'Has an invalid file type. Allowed types are: {allowedFileTypes}',
        EXCEED_FILE_SIZE: 'Exceeds the maximum size of {maxFileSize}.',
        CREDENTIAL_NOT_FOUND: 'Credential not found',
        LOGIN_FAILED: 'Login Failed',
        DECODING_JWT: 'Error decoding JWT:',
    },
    IDENTIFIER: {
        MAX_FILE: '{maxFiles}',
        ALLOWED_FILE: '{allowedFileTypes}',
        MAX_FILE_SIZE: '{maxFileSize}',
    },
    SUCCESS: {
        TASK_CREATED: 'Task created successfully!',
    },
    LABEL: {
        REMOVE_FILE: 'Remove file?',
    },
    BUTTON: {
        CANCEL: 'Cancel',
        DELETE: 'Delete',
        CLOSE: 'Close',
    },
    SUBTASK: {
        DELETE_SUBTASK: 'Delete this Subtask?',
    },
};
