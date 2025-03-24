import React, { ReactNode } from 'react';
import Wallpaper from './../assets/Wallpaper.svg';
import BrandAndLogo from './../assets/Brand and logo.svg';
import Facebook from './../assets/Icons/Facebook.svg';
import {
    GridContainer,
    ImageGridItem,
    FormGridItem,
    OrDivider,
    SigninOptionButton,
    IconWrapper,
    ImageGridMobile,
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
                <img src={BrandAndLogo} alt="Brand Logo" />
            </ImageGridItem>
            <ImageGridMobile>
                <img src={BrandAndLogo} alt="Brand Logo" />
            </ImageGridMobile>
            <FormGridItem item xs={12} md={6}>
                {children}
                <OrDivider>OR</OrDivider>
                <GoogleLoginComponent></GoogleLoginComponent>

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
