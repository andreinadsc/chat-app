import { useContext, useEffect, useState } from 'react';

import { Typography, Card, CardContent, Avatar, Box } from '@mui/material';
import NotificationIcon from '@mui/icons-material/CircleNotifications';

import ChatContext from '../../../context/chat-context';
import getSender from '../../../utils/chatLogics';

import classes from './ChatCard.module.css';

const ChatCard = ({ chat, handlerClick }) => {
    const { currentChat, user, notifications } = useContext(ChatContext);
    const [unreadMsg, setUnreadMsg] = useState(false);

    const sender = getSender(chat.users, user);
    const title = !chat.isGroupChat ? sender?.name : chat.chatName;
    const imgSrc = `https://chat-app-nbgl.onrender.com/${!chat.isGroupChat ? sender?.picture : chat.groupPicture}`;
    const colorText = currentChat?._id === chat?._id ? 'primary.secondary' : 'text.secondary';

    useEffect(() => {
        notifications?.length > 0
            && setUnreadMsg(notifications.some(notification => notification.chat._id === chat?._id));
    }, [notifications, chat?._id]);

    return (
        <Card className={classes.card} onClick={() => handlerClick(chat)}
            sx={{ backgroundColor: currentChat?._id === chat?._id ? 'primary.main' : 'primary.secondary' }}>
            <Avatar alt={title} src={imgSrc} sx={{ width: 56, height: 56 }} />
            <CardContent className={classes.container}>
                <Typography className={classes.title}
                    component='h4'
                    variant='h4'
                    color={currentChat?._id === chat?._id ? 'primary.secondary' : 'primary.main'}
                >
                    {title}
                </Typography>
                {
                    unreadMsg && <NotificationIcon className={classes.icon} fontSize='large' color='primary' />
                }
                {
                    chat && chat.isGroupChat && chat.latestMessage &&
                    <Box className={classes.message}>
                        <Typography variant='subtitle1' color={colorText} component='h6'>
                            <b>{chat?.latestMessage?.sender?.name}: </b></Typography>
                        <Typography variant='subtitle1' color={colorText} component='span'>
                            {chat?.latestMessage?.content?.length > 50
                                ? chat?.latestMessage?.content.substring(0, 51) + '...'
                                : chat?.latestMessage?.content}
                        </Typography>
                    </Box>
                }
            </CardContent>
        </Card>
    );
};

export default ChatCard;
