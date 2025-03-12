import React, { ReactNode } from 'react';
import Wallpaper from './../assets/Wallpaper.svg';
import BrandAndLogo from './../assets/Brand and logo.svg';
import Facebook from './../assets/Icons/Facebook.svg';
// import Google from './../assets/Icons/Google.svg'
import {
    GridContainer,
    ImageGridItem,
    FormGridItem,
    ImageLogoItem,
    OrDivider,
    SigninOptionButton,
    IconWrapper,
} from '../layouts/CoverPageStyles';
import GoogleLoginComponent from './GoogleLoginComponent';

interface CoverPageComponentProps {
    children: ReactNode;
}

const CoverPageComponent: React.FC<CoverPageComponentProps> = ({ children }) => {
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
                <GoogleLoginComponent></GoogleLoginComponent>
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
