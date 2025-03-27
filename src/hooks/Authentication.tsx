import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState, selectIsAuthenticated } from '../state/AuthState';

interface Props {
    children: React.ReactNode;
}

const Authentication: React.FC<Props> = ({ children }) => {
    const navigate = useNavigate();

    const isAuthenticated = useAuthState(selectIsAuthenticated);

    useEffect(() => {
        if (!isAuthenticated) navigate('/login');
    }, [isAuthenticated, navigate]);

    return <>{children}</>;
};

export default Authentication;
