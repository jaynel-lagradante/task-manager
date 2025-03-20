import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
    children: React.ReactNode;
}

const Authentication: React.FC<Props> = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('token')) navigate('/login');
    }, [navigate]);

    return <>{children}</>;
};

export default Authentication;
