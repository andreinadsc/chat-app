import { useContext, useEffect } from 'react';

import { Box, Paper, Button, Typography, Drawer, useMediaQuery } from '@mui/material';
import AddCircle from '@mui/icons-material/AddCircle';

import ChatContext from '../../../context/chat-context';
import useHttp from '../../../hooks/https';

import ChatCard from './ChatCard';
import NewGroupModal from '../../Modals/NewGroupModal';
import ErrorBox from '../../Common/ErrorBox';

const MyChats = ({ handlerNotificationClick }) => {
    const { token, setChats, chats, user, currentChat, notifications } = useContext(ChatContext);
    const { error, sendRequest } = useHttp();

    const isTablet = useMediaQuery((theme) => theme.breakpoints.between('sm', 'lg'));
    const height = isTablet ? '81.5vh' : '77vh';

    useEffect(() => {
        sendRequest(
            {
                url: 'chats',
                token: token
            },
            (data) => {
                setChats(data);
            });
    }, [token, user, currentChat, notifications, sendRequest, setChats]);

    return (
        <>
            <Paper sx={{ p: 1, borderRadius: 0 }}>
                <Box display='flex' sx={{ ml: 2, mt: 1}}>
                    <Typography
                        variant='h6'
                        component='div'
                        sx={{
                            mr: 2,
                            mb: 2,
                            fontWeight: 700,
                            fontFamily: 'monospace',
                            letterSpacing: '.2rem',
                            color: 'primary.main',
                            fontSize: '2rem',
                            textTransform: 'uppercase'
                        }}
                    >
                        My Chats
                    </Typography>
                    <NewGroupModal>
                        <Button
                            sx={{ mt: '.2rem' }}
                            fontSize='1rem'
                            endIcon={<AddCircle sx={{ml: .3}}/>}>
                            New Group
                        </Button>
                    </NewGroupModal>
                </Box>
                <Drawer
                    variant='permanent'
                    sx={{
                        height: height,
                        '@media screen and (orientation: landscape)': {
                            height: '75vh'
                        },
                        '& .MuiPaper-root': {
                            position: 'relative',
                            border: 'none'
                        }
                    }}
                >
                    {
                        chats?.map((chat) => 
                            <ChatCard handlerClick={handlerNotificationClick} key={chat._id} chat={chat} />)
                    }
                </Drawer>
            </Paper>
            {
                error && <ErrorBox message={error} title='Something went wrong while loading your chats' />
            }
        </>
    );
};

export default MyChats;
