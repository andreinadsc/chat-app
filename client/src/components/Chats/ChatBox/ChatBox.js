import { useContext, useEffect, useState, useRef } from 'react';

import { Paper, AppBar, Toolbar, Typography, CircularProgress, Box, Avatar, useMediaQuery, IconButton } from '@mui/material/';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

import classes from './ChatBox.module.css';

import ChatContext from '../../../context/chat-context.js';
import useHttp from '../../../hooks/https.js';

import ProfileModal from '../../Modals/ProfileModal.js';
import UpdateGroupModal from '../../Modals/UpdateGroupModal.js';
import ErrorBox from '../../Common/ErrorBox.js';
import { TextInput } from './TextInput.js';
import { MessageLeft, MessageRight } from './Message';

import { socket } from '../../../utils/socket.js';
import getSender from '../../../utils/chatLogics';

export default function ChatBox({ handleDrawer }) {
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery((theme) => theme.breakpoints.between('sm', 'lg'));

    const { token, currentChat, user, setNotifications, notifications, setCurrentChat } = useContext(ChatContext);
    const { isLoading, error, sendRequest } = useHttp();
    const [isTyping, setIsTyping] = useState(false);

    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(socket.connected);

    const lastMessageRef = useRef(null);

    useEffect(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (!currentChat) return;

        sendRequest(
            {
                url: `messages/${currentChat._id}`,
                token: token
            },
            (data) => {
                setMessages(data);
                socket.emit('join chat', currentChat._id);
            }
        )

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentChat?._id]);

    useEffect(() => {
        socket.on('message recieved', newMessage => {
            if ((!currentChat || currentChat?._id !== newMessage.chat._id) && !notifications.includes(newMessage)) {
                sendRequest(
                    {
                        url: 'notifications',
                        method: 'POST',
                        token,
                        body: {
                            chatId: newMessage.chat._id,
                            messageId: newMessage._id
                        }
                    },
                    (data) => {
                        setNotifications([data, ...notifications]);
                    })
            } else {
                setMessages(prev => {
                    if (prev.includes(newMessage)) return prev;
                    return [...prev, newMessage];
                });
            }
        });

        socket.on('typing', () => { setIsTyping(true); });
        socket.on('stop typing', () => setIsTyping(false));

        return () => socket.off('message recieved');

    });

    useEffect(() => {
        socket.on('applying changes', (chat) => {
            setCurrentChat(chat);
        });
    });

    useEffect(() => {
        socket.emit('setup', user._id);
        socket.on('connected', () => setIsConnected(true));
        socket.on('disconnect', () => setIsConnected(false));
    }, [user._id]);

    return (
        <Box className={`${classes.container} ${isTablet ? classes.containerTablet : ''} ${isMobile ? classes.containerMobile : ''}`}>
            <Box className={`${classes.paper} ${isTablet ? classes.paperTablet : ''} ${isMobile ? classes.paperMobile : ''}`} elevation={2}>
                {
                    currentChat
                        ?
                        <>
                            {isLoading && !error && <CircularProgress sx={{ pt: 3, mt: 3 }} />}
                            {!isLoading && !error &&
                                <>
                                    <AppBar position='static'>
                                        <Toolbar>
                                            {
                                                isMobile && <IconButton
                                                    onClick={() => handleDrawer(false)}
                                                    size='large'>
                                                    <ArrowBackIosNewIcon sx={{ color: 'primary.secondary' }} />
                                                </IconButton>
                                            }
                                            <Avatar
                                                alt='picture'
                                                src={`http://localhost:8080/${!currentChat.isGroupChat ? getSender(currentChat.users, user)?.picture : currentChat.groupPicture}`}
                                                sx={{ width: 56, height: 56 }}
                                            />
                                            <Typography variant='h6' component='div' sx={{ flexGrow: 1, ml: 2 }}>
                                                {currentChat.isGroupChat ? currentChat.chatName : getSender(currentChat.users, user)?.name}
                                            </Typography>
                                            {
                                                (currentChat?.groupAdmin?._id === user._id ?
                                                    <UpdateGroupModal />
                                                    : <ProfileModal myProfile={false} />)
                                            }
                                        </Toolbar>
                                    </AppBar>
                                    {
                                        messages.length > 0 ?
                                            <Paper elevation={5} className={classes.messagesBody}>
                                                {
                                                    messages.map(message => {
                                                        const timestamp = `${new Date(message.createdAt).toLocaleDateString()} 
                                                            ${new Date(message.createdAt).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`;

                                                        if (message.sender._id === user._id) {
                                                            return <MessageRight key={message._id}
                                                                message={message.content}
                                                                timestamp={timestamp}
                                                            />
                                                        } else {
                                                            return <MessageLeft key={message._id}
                                                                message={message.content}
                                                                timestamp={timestamp}
                                                                photoURL={`http://localhost:8080/${message.sender.picture}`}
                                                                displayName={message.sender.name}
                                                                avatarDisp={true}
                                                            />
                                                        }
                                                    })
                                                }
                                                {isTyping && (
                                                    <div className={classes['bouncing-loader']}>
                                                        <div></div>
                                                        <div></div>
                                                        <div></div>
                                                    </div>
                                                )}
                                                <div ref={lastMessageRef}></div>
                                            </Paper>
                                            : <p className={classes.info}><b> No messages yet! </b> Start chatting with people around you.</p>
                                    }

                                    <TextInput setIsTyping={setIsTyping} isConnected={isConnected} setMessages={setMessages} socket={socket} />
                                </>
                            }
                            {error && <ErrorBox message={error} title='Ooops! We were unable to retrieve your messages for this chat, please try again later' />}
                        </>
                        : <p className={classes.info}><b>You currently have no active chats.</b> Select one on the panel My Chats or search one to start a conversation</p>}
            </Box>
        </Box>
    );
}
