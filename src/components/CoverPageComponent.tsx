import React, { ReactNode } from 'react';
import Wallpaper from './../assets/Wallpaper.svg';
import BrandAndLogo from './../assets/Brand and logo.svg';
import Facebook from './../assets/Icons/Facebook.svg';
import Google from './../assets/Icons/Google.svg'
import { GridContainer, ImageGridItem, FormGridItem, ImageLogoItem, OrDivider, SigninOptionButton, IconWrapper } from '../layouts/CoverPageStyles';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { GoogleAuth } from '../services/AuthService';

interface CoverPageComponentProps {
    children: ReactNode;
}

const CoverPageComponent: React.FC<CoverPageComponentProps> = ({ children }) => {
    const navigate = useNavigate();
    const onSuccess = async (credentialResponse: any) => { // Type the credentialResponse
        if (credentialResponse && credentialResponse.credential) {
            await GoogleAuth(credentialResponse.credential); // Pass the credential (token)
            navigate('/');
        } else {
            console.error('Credential not found in response');
        }
    };

    const onError = () => {
        console.log('Login Failed');
    };

    return (
        <GridContainer container>
            <ImageGridItem
                item
                xs={12}
                md={6}
                style={{
                    backgroundImage: `url(${Wallpaper})`,
                }}
            >
                <ImageLogoItem src={BrandAndLogo} alt="Brand Logo" />
            </ImageGridItem>
            <FormGridItem item xs={12} md={6}>
                {children}
                <OrDivider>OR</OrDivider>
                <GoogleOAuthProvider clientId='52818097788-vtui6hcvtsg7g2t659h5v3al5ttl33p1.apps.googleusercontent.com'>
                    <GoogleLogin onSuccess={onSuccess} onError={onError} />
                </GoogleOAuthProvider>


                {/* <FacebookLogin
                    appId={'1917908192286593'}
                    autoLoad={false}
                    fields="name,email,picture"
                    callback={responseFacebook}
                /> */}
                {/* <SigninOptionButton
                    fullWidth
                    startIcon={
                        <IconWrapper>
                            <img src={Google} alt="Google Icon" />
                        </IconWrapper>
                    }
                >
                    Continue with Google
                </SigninOptionButton> */}

                <SigninOptionButton
                    fullWidth
                    startIcon={
                        <IconWrapper>
                            <img src={Facebook} alt="Facebook Icon" />
                        </IconWrapper>
                    }
                >
                    Continue with Facebook
                </SigninOptionButton>
            </FormGridItem>
        </GridContainer>
    );
};

export default CoverPageComponent;