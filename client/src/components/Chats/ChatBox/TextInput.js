import { useContext, useState } from 'react'

import { Button, Box } from '@mui/material/';
import SendIcon from '@mui/icons-material/Send';
import InputEmoji from 'react-input-emoji'

import ChatContext from '../../../context/chat-context';
import useHttp from '../../../hooks/https';

import classes from './TextInput.module.css';

export const TextInput = ({ isConnected, setMessages, socket }) => {
    const { token, currentChat } = useContext(ChatContext);
    const { sendRequest } = useHttp();

    const [text, setText] = useState('');
    const [typing, setTyping] = useState(false);

    const handleSubmit = async (event) => {
        if (typeof event !== 'string') event.preventDefault();

        if (text === '') return;

        setText('');
        socket.emit('stop typing', currentChat?._id);
        setTyping(false);

        sendRequest(
            {
                url: 'messages',
                method: 'POST',
                token: token,
                body: {
                    chatId: currentChat._id,
                    content: text
                }
            },
            (data) => {
                socket.emit('new message', data);
                const anyDisconnect = data?.chat?.users.filter(user => user.status === 'disconnected');
                if (anyDisconnect.length > 0) {
                    sendRequest(
                        {
                            url: 'notifications',
                            method: 'POST',
                            token,
                            body: {
                                chatId: data.chat._id,
                                messageId: data._id,
                                users: anyDisconnect.map(disconnected => disconnected._id)
                            }
                        })
                }

                setMessages(prev => [...prev, data]);
            }
        );
    };

    const typingHandler = (text) => {
        setText(text);
        let isTyping = false;

        if (!isConnected) return;

        if (!typing) {
            isTyping = true;
            setTyping(true);
            socket.emit('typing', currentChat._id);
        }

        const lastTypingTime = new Date().getTime();
        const timerLength = 3000;
        setTimeout(() => {

            const timeNow = new Date().getTime();
            const timeDiff = timeNow - lastTypingTime;

            if (timeDiff >= timerLength && isTyping) {
                socket.emit('stop typing', currentChat._id);
                setTyping(false);
            }

        }, timerLength);
    };

    return (
        <Box component='form' onSubmit={handleSubmit} className={classes.wrapForm} noValidate autoComplete='off'>
            <InputEmoji
                value={text}
                onChange={typingHandler}
                cleanOnEnter
                onEnter={handleSubmit}
                className={classes.wrapText}
                placeholder='Type a message'
                fontSize={10}
            />
            <Button type='submit' variant='contained' color='primary' className={classes.button}>
                <SendIcon />
            </Button>
        </Box>
    );
};
