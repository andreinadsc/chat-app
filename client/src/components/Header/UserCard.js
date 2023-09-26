import { useContext } from 'react';

import { Typography, Avatar, Paper } from '@mui/material';

import ChatContext from '../../context/chat-context';
import useHttp from '../../hooks/https';

const UserCard = ({ user, closeSearch }) => {
    const { token, setChats, setCurrentChat } = useContext(ChatContext);
    const { sendRequest } = useHttp();

    const handlerUserClick = async () => {
        sendRequest(
            {
                url: `chats/${user._id}`,
                token: token,
                method: 'POST'
            },
            (data) => {
                if (!data.chatExist) setChats(prev => [...prev, data.chat]);
                setCurrentChat(data.chat);
                closeSearch();
            }
        )
    };

    return (
        <Paper sx={{ display: 'flex', mx: 3, my: 1, p: 1, height: '8rem', alignItems: 'center', backgroundColor: 'primary.secondary' }} onClick={handlerUserClick}>
            <Avatar
                alt={user.name}
                src={`http://localhost:8080/${user.picture}`}
                sx={{ width: 56, height: 56 }}
            />
            <Typography component='h5' variant='h4' sx={{ textAlign: 'center', pl: 3}}>
                {user.name}
            </Typography>
        </Paper>
    );
};

export default UserCard;
