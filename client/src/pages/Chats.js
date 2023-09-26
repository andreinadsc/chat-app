import { useContext, useState, useEffect } from 'react';

import { Drawer, useMediaQuery, Box } from '@mui/material';

import ChatBox from '../components/Chats/ChatBox/ChatBox';
import MyChats from '../components/Chats/MyChats/MyChats';
import Header from '../components/Header/Header';
import AuthVerify from '../components/Common/AuthVerify';

import ChatContext from '../context/chat-context';
import useHttp from '../hooks/https';

import classes from './Chats.module.css';

const Chats = () => {
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery((theme) => theme.breakpoints.between('sm', 'lg'));

    const { user, token, setNotifications, setCurrentChat, notifications, setSession, expiryDate } = useContext(ChatContext);
    const [openDrawer, setOpenDrawer] = useState(false);

    const { sendRequest } = useHttp();

    const handlerNotificationClick = async (chat) => {
        setCurrentChat(chat);

        if (notifications.length > 0) {
            const currentNotifications = notifications?.filter(notification => notification.chat?._id !== chat?._id);

            sendRequest(
                {
                    url: `notifications/${chat._id}`,
                    method: 'DELETE',
                    token: token
                },
                () => {
                    setNotifications(currentNotifications);
                }
            );
        }
        
        setOpenDrawer(true);
    };

    useEffect(() => {
        const userStorage = JSON.parse(localStorage.getItem('user'));
        const tokenStorage = localStorage.getItem('token');

        if (!user && userStorage && tokenStorage) {
            setSession(userStorage, tokenStorage);
        }
    });

    return (
        <>
            {
                (user && token && new Date(expiryDate) > new Date()) &&
                <>
                    <Header handlerNotificationClick={handlerNotificationClick} />
                    <Box className={isMobile ? classes.chatsContainerMobile : `${classes.chatsContainer} ${isTablet ? classes.tablet : ''}`}>
                        <Box>
                            <MyChats handlerNotificationClick={handlerNotificationClick} />
                        </Box>
                        {
                            !isMobile ?
                            <Box>
                                <ChatBox />
                            </Box>
                            : <Drawer
                                variant='temporary'
                                anchor='right'
                                open={openDrawer}
                                onClose={() => setOpenDrawer(false)}
                            >
                                <ChatBox handleDrawer={setOpenDrawer} />
                            </Drawer>
                        }
                    </Box>
                </>
            }
            <AuthVerify logOut={setSession}/>
        </>
    );
};

export default Chats;
