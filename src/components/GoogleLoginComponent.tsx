import React from 'react';
import Google from './../assets/Icons/Google.svg';
import { SigninOptionButton, IconWrapper } from '../layouts/CoverPageStyles';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { GoogleAuth } from '../services/AuthService';

const GoogleLoginComponent: React.FC = () => {
    const navigate = useNavigate();

    const GoogleLoginButton = () => {
        const handleGoogleAuth = useGoogleLogin({
            onSuccess: async (credentialResponse: any) => {
                if (credentialResponse && credentialResponse.code) {
                    await GoogleAuth(credentialResponse.code);
                    navigate('/');
                } else {
                    console.error('Credential not found in response');
                }
            },
            onError: () => console.log('Login Failed'),
            flow: 'auth-code',
        });

        return (
            <SigninOptionButton
                onClick={() => handleGoogleAuth()}
                fullWidth
                startIcon={
                    <IconWrapper>
                        <img src={Google} alt="Google Icon" />
                    </IconWrapper>
                }
            >
                Continue with Google
            </SigninOptionButton>
        );
    };

    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ''}>
            <GoogleLoginButton></GoogleLoginButton>
        </GoogleOAuthProvider>
    );
};

export default GoogleLoginComponent;
