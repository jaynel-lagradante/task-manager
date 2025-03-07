import React from 'react';
import Google from './../assets/Icons/Google.svg'
import { SigninOptionButton, IconWrapper } from '../layouts/CoverPageStyles';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { GoogleAuth } from '../services/AuthService';


const GoogleLoginComponent: React.FC = () => {
    const navigate = useNavigate();

    const GoogleLoginButton = () => {
        const handleGoogleAuth = useGoogleLogin({
          onSuccess: async (credentialResponse: any) => {
            if (credentialResponse && credentialResponse.access_token) {
                await GoogleAuth(credentialResponse.access_token); 
                navigate('/');
            } else {
                console.error('Credential not found in response');
            }
          },
          onError: () => console.log("Login Failed"),
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

    //   const onSuccess = async (credentialResponse: any) => { // Type the credentialResponse
    //     console.log(credentialResponse);
    //     if (credentialResponse && credentialResponse.credential) {
    //         await GoogleAuth(credentialResponse.credential); // Pass the credential (token)
    //         navigate('/');
    //     } else {
    //         console.error('Credential not found in response');
    //     }
    // };

    // const onError = () => {
    //     console.log('Login Failed');
    // };

    return (
        <GoogleOAuthProvider clientId='52818097788-vtui6hcvtsg7g2t659h5v3al5ttl33p1.apps.googleusercontent.com'>
            <GoogleLoginButton></GoogleLoginButton>
            {/* <GoogleLogin onSuccess={onSuccess} onError={onError} /> */}
        </GoogleOAuthProvider>
    );
};

export default GoogleLoginComponent;