import { useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { Avatar, Link, Grid, Box, Typography, Container } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import LockPersonIcon from '@mui/icons-material/LockPerson';

import useForm from '../../hooks/forms';
import useHttp from '../../hooks/https';

import ChatContext from '../../context/chat-context';

import ErrorBox from '../Common/ErrorBox';
import Login from './Login';
import SignUp from './SignUp';
import ForgotPassword from './ForgotPassword';

const Authentication = ({ handleChange, type, title }) => {
    const navigate = useNavigate();

    const logoutTimerIdRef = useRef(null);

    const { isLoading, error, sendRequest } = useHttp();
    const { formInputs, dispatch } = useForm(type);
    const { setSession, user } = useContext(ChatContext);

    const handleSubmit = async (event) => {
        event.preventDefault();
        sendRequest(
            {
                method: 'POST',
                url: `user/${type}`,
                body: formInputs.init
            },
            (data) => {
                if (type === 'login') {
                    const remainingMilliseconds = 60 * 60 * 1000;

                    setSession(data.user, data.token, remainingMilliseconds);
                    navigate('chats');
                    autoLogout();
                }
                else handleChange('event', '1');
            }
        )
    };

    const autoLogout = () => {
        const timeOutId = window.setTimeout(() => {
            sendRequest(
                {
                    url: 'user/logout',
                    method: 'POST',
                    body: {
                        userId: user._id
                    }
                }
            );
            setSession();
            return navigate('/');
        }, 60 * 60 * 1000);
        logoutTimerIdRef.current = timeOutId;
    };

    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockPersonIcon />
            </Avatar>
            <Typography component='h1' variant='h5' align='center'>
                {title}
            </Typography>
            <Box component='form' noValidate onSubmit={handleSubmit} sx={{ mt: 3 }} encType='multipart/form-data'>
                <Grid container spacing={2}>
                    {type === 'login' && <Login formInputs={formInputs} dispatch={dispatch} />}
                    {type === 'signup' && <SignUp formInputs={formInputs} dispatch={dispatch} />}
                    {type === 'password' && <ForgotPassword formInputs={formInputs} dispatch={dispatch} />}
                </Grid>
                <LoadingButton disabled={!formInputs.isFormValid} loading={isLoading} variant='contained' type='submit' fullWidth sx={{ mt: 3, mb: 2 }}>
                    {title}
                </LoadingButton>
                <Grid justifyContent='flex-end'>
                    {
                        type === 'signup' &&
                        <Grid item>
                            <Link href='#' disabled={!formInputs.isFormValid} onClick={() => handleChange('event', '1')} variant='body2'>
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    }
                    {
                        type === 'login' &&
                        <>
                            <Grid item xs>
                                <Link href='#' onClick={() => handleChange('event', '3')} variant='body2'>
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href='#' onClick={() => handleChange('event', '2')} variant='body2'>
                                    {'Don\'t have an account? Sign Up'}
                                </Link>
                            </Grid>
                        </>
                    }
                </Grid>
                {
                    error && <ErrorBox error={error} title='Something went wrong' />
                }
            </Box>
        </Container>
    );
};

export default Authentication;
