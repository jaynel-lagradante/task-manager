import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState, selectIsAuthenticated, selectToken } from '../state/AuthState';

interface Props {
    children: React.ReactNode;
}

const Authentication: React.FC<Props> = ({ children }) => {
    const navigate = useNavigate();

    const isAuthenticated = useAuthState(selectIsAuthenticated);
    const tokenState = useAuthState(selectToken);

    useEffect(() => {
        if (!tokenState && !isAuthenticated) navigate('/login');
    }, [isAuthenticated, tokenState, navigate]);

    return <>{children}</>;
};

export default Authentication;
