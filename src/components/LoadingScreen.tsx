import React from 'react';
import { LinearProgress } from '@mui/material';
import { selectIsLoading, useLoadingState } from '../state/LoadingState';

interface LoadingScreenProps {
    open: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = () => {
    const isLoading = useLoadingState(selectIsLoading);
    return <>{isLoading && <LinearProgress sx={{ zIndex: (theme) => theme.zIndex.drawer + 2 }} />}</>;
};

export default LoadingScreen;
