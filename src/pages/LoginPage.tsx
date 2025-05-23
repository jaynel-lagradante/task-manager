import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Typography, InputAdornment, IconButton } from '@mui/material';
import { Login } from './../services/AuthService';
import ShowPasswordIcon from './../assets/Icons/Show.svg';
import HidePasswordIcon from './../assets/Icons/Hide.svg';
import { SignupLink, SignupMessageItem, SubmitButton } from '../layouts/CoverPageStyles';
import CoverPageComponent from './../components/CoverPageComponent';
import { useAuthState } from '../state/AuthState';
import { useTaskState } from '../state/TaskState';
import { MESSAGES } from '../constants/Messages';
import { ROUTES } from '../constants/Routes';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loginError, setLoginError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { setAuth } = useAuthState();
    const { setTasks } = useTaskState();

    const handleLogin = async () => {
        setUsernameError('');
        setPasswordError('');
        setLoginError('');
        let hasError = false;
        const { REQUIRED_USERNAME, REQUIRED_PASSWORD, LOGIN_FAILED } = MESSAGES.ERROR;

        if (!username) {
            setUsernameError(REQUIRED_USERNAME);
            hasError = true;
        }

        if (!password) {
            setPasswordError(REQUIRED_PASSWORD);
            hasError = true;
        }

        if (hasError) {
            return;
        }

        try {
            await Login({ username, password });
            setAuth(true);
            setTasks([]);
            navigate('/');
        } catch (err: any) {
            setLoginError(err.response?.data?.message || LOGIN_FAILED);
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
            <Typography variant="h4" align="left" gutterBottom>
                Sign In
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

                <SignupLink onClick={() => navigate(ROUTES.REGISTER)}>Sign up</SignupLink>
            </SignupMessageItem>
        </CoverPageComponent>
    );
};

export default LoginPage;
