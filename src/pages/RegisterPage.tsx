import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Typography, InputAdornment, IconButton, List, ListItemIcon, ListItemText } from '@mui/material';
import { Register } from '../services/AuthService';
import {
    PasswordChecklist,
    PasswordListIconImg,
    SignupLink,
    SignupMessageItem,
    SubmitButton,
} from '../layouts/CoverPageStyles';
import ShowPasswordIcon from './../assets/Icons/Show.svg';
import HidePasswordIcon from './../assets/Icons/Hide.svg';
import Bullet from './../assets/Icons/Bullet.svg';
import Check from './../assets/Icons/Check.svg';
import CoverPageComponent from './../components/CoverPageComponent';
import { MESSAGES } from '../constants/Messages';

const RegisterPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [registerError, setRegisterError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [nameEmailCheck, setNameEmailCheck] = useState(false);
    const [lengthCheck, setLengthCheck] = useState(false);
    const [numberSymbolCheck, setNumberSymbolCheck] = useState(false);
    const [passwordCheck, setPasswordCheck] = useState(0);
    const allowedSymbols = /^[a-zA-Z0-9\s!#()_-]*$/;
    const navigate = useNavigate();
    const {
        PASSWORD_STRONG,
        PASSWORD_WEAK,
        PASSWORD_SYMBOL,
        USERNAME_SYMBOL,
        REQUIRED_USERNAME,
        REQUIRED_PASSWORD,
        USERNAME_EXIST,
        REGISTER_FAILED,
    } = MESSAGES.ERROR;

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const username = e.target.value;
        setUsername(username);
        setUsernameError('');
        if (!allowedSymbols.test(username)) {
            setUsernameError(MESSAGES.ERROR.USERNAME_SYMBOL);
        }
        if (password) {
            checkPasswordStrength(password);
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const password = e.target.value;
        setPassword(password);
        checkPasswordStrength(password);
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event: React.MouseEvent) => {
        event.preventDefault();
    };

    const checkPasswordStrength = (password: string) => {
        if (!password || !username) {
            setNameEmailCheck(false);
        } else {
            const usernameLower = username.toLowerCase();
            const passwordLower = password.toLowerCase();
            const firstThreeUsername = usernameLower.slice(0, 3);
            setNameEmailCheck(!passwordLower.includes(usernameLower) && !passwordLower.includes(firstThreeUsername));
        }
        setLengthCheck(password.length >= 8);
        setNumberSymbolCheck(/\d|[!@#$%^&*(),.?":{}|<>]/.test(password));
    };

    useEffect(() => {
        const checks = [nameEmailCheck, lengthCheck, numberSymbolCheck].filter(Boolean).length;
        setPasswordCheck(checks);
        if (!allowedSymbols.test(password)) {
            setPasswordError(PASSWORD_SYMBOL);
            return;
        }
        if (checks === 3) {
            setPasswordError(PASSWORD_STRONG);
        } else if (password || checks >= 1) {
            setPasswordError(PASSWORD_WEAK);
        } else {
            setPasswordError('');
        }
    }, [nameEmailCheck, lengthCheck, numberSymbolCheck, password]);

    const handleRegister = async () => {
        let hasError = false;
        if (!username) {
            setUsernameError(REQUIRED_USERNAME);
            hasError = true;
        }

        if (!allowedSymbols.test(username)) {
            setUsernameError(USERNAME_SYMBOL);
            hasError = true;
        }

        if (!allowedSymbols.test(password)) {
            setPasswordError(PASSWORD_SYMBOL);
            hasError = true;
        }

        if (!password) {
            setPasswordError(REQUIRED_PASSWORD);
            hasError = true;
        }

        if (hasError || passwordCheck !== 3) {
            return;
        }

        setUsernameError('');
        setPasswordError('');
        setRegisterError('');

        try {
            await Register({ username, password });
            navigate('/login', { state: { registrationMessage: MESSAGES.SUCCESS.REGISTRATION_SUCCESS } });
        } catch (err: any) {
            if (err.response?.data?.message === USERNAME_EXIST) {
                setUsernameError(USERNAME_EXIST);
            } else {
                setRegisterError(err.response?.data?.message || REGISTER_FAILED);
            }
        }
    };

    return (
        <CoverPageComponent>
            <Typography variant="h4" align="left" gutterBottom>
                Create an account
            </Typography>
            {registerError && <Typography color="error">{registerError}</Typography>}
            <TextField
                label="Username"
                variant="outlined"
                fullWidth
                margin="normal"
                value={username}
                onChange={handleUsernameChange}
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
                onChange={handlePasswordChange}
                color="primary"
                error={!!passwordError && passwordCheck !== 3}
                helperText={passwordError}
                FormHelperTextProps={{
                    sx: {
                        color: passwordCheck === 3 && allowedSymbols.test(password) ? '#027CEC' : 'red',
                    },
                }}
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
            <List>
                <PasswordChecklist>
                    <ListItemIcon>
                        {nameEmailCheck ? (
                            <PasswordListIconImg src={Check} alt="Check" />
                        ) : (
                            <PasswordListIconImg src={Bullet} alt="Bullet" />
                        )}
                    </ListItemIcon>
                    <ListItemText primary="Password cannot contain your username" />
                </PasswordChecklist>
                <PasswordChecklist>
                    <ListItemIcon>
                        {lengthCheck ? (
                            <PasswordListIconImg src={Check} alt="Check" />
                        ) : (
                            <PasswordListIconImg src={Bullet} alt="Bullet" />
                        )}
                    </ListItemIcon>
                    <ListItemText primary="At least 8 characters" />
                </PasswordChecklist>
                <PasswordChecklist>
                    <ListItemIcon>
                        {numberSymbolCheck ? (
                            <PasswordListIconImg src={Check} alt="Check" />
                        ) : (
                            <PasswordListIconImg src={Bullet} alt="Bullet" />
                        )}
                    </ListItemIcon>
                    <ListItemText primary="Contains a number or symbol" />
                </PasswordChecklist>
            </List>
            <SubmitButton variant="contained" color="primary" fullWidth onClick={handleRegister}>
                Register
            </SubmitButton>
            <SignupMessageItem>
                <Typography>Already have an account?</Typography>

                <SignupLink onClick={() => navigate('/login')}>Sign in</SignupLink>
            </SignupMessageItem>
        </CoverPageComponent>
    );
};

export default RegisterPage;
