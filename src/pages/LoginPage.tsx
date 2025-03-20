import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TextField, Typography, InputAdornment, IconButton } from '@mui/material';
import { Login } from './../services/AuthService';
import ShowPasswordIcon from './../assets/Icons/Show.svg';
import HidePasswordIcon from './../assets/Icons/Hide.svg';
import { SignupLink, SignupMessageItem, SubmitButton } from '../layouts/CoverPageStyles';
import CoverPageComponent from './../components/CoverPageComponent';
import { useAuthState } from '../state/AuthState';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loginError, setLoginError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [registrationMessage, setRegistrationMessage] = useState<string | null>(null);
    const { setAuth } = useAuthState();

    useEffect(() => {
        if (location.state && location.state.registrationMessage) {
            setRegistrationMessage(location.state.registrationMessage);
        }
    }, [location.state]);

    const handleLogin = async () => {
        setUsernameError('');
        setPasswordError('');
        setLoginError('');
        let hasError = false;

        if (!username) {
            setUsernameError('Username is required');
            hasError = true;
        }

        if (!password) {
            setPasswordError('Password is required');
            hasError = true;
        }

        if (hasError) {
            return;
        }

        try {
            await Login({ username, password });
            setAuth(true);
            navigate('/');
        } catch (err: any) {
            setLoginError(err.response?.data?.message || 'Login failed');
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event: React.MouseEvent) => {
        event.preventDefault();
    };

    return (
        <CoverPageComponent>
            {registrationMessage && <Typography variant="h4">{registrationMessage}</Typography>}
            <Typography variant="h4" align="left" gutterBottom>
                {registrationMessage ? 'Sign in to continue' : 'Sign In'}
            </Typography>
            {loginError && <Typography color="error">{loginError}</Typography>}
            <TextField
                label="Username"
                variant="outlined"
                fullWidth
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                error={!!usernameError}
                helperText={usernameError}
            />
            <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!passwordError}
                helperText={passwordError}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                            >
                                {showPassword ? (
                                    <img src={ShowPasswordIcon} alt="Show Password" />
                                ) : (
                                    <img src={HidePasswordIcon} alt="Hide Password" />
                                )}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
            <SubmitButton variant="contained" color="primary" fullWidth onClick={handleLogin}>
                Sign In
            </SubmitButton>
            <SignupMessageItem>
                <Typography>Don't have an account?</Typography>

                <SignupLink onClick={() => navigate('/register')}>Sign up</SignupLink>
            </SignupMessageItem>
        </CoverPageComponent>
    );
};

export default LoginPage;
