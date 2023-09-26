
import { useEffect, useState } from 'react';

import ChatContext from './chat-context';
import useHttp from '../hooks/https';

const ChatProvider = ({ children }) => {
    const { sendRequest } = useHttp();

    const [user, setUser] = useState(null);
    const [currentChat, setCurrentChat] = useState(null);
    const [chats, setChats] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [token, setToken] = useState(null);
    const [expiryDate, setExpiryDate] = useState(null);

    useEffect(() => {
        const userInfo = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        const expiryDate = localStorage.getItem('expiryDate');

        if (userInfo) setUser(JSON.parse(userInfo));
        if (token) setToken(token);
        if (expiryDate) setExpiryDate(expiryDate)

    }, []);

    const setSession = async (userParams = null, tokenParams = null, miliseconds = null) => {
        try {
            if (!userParams) {
                sendRequest(
                    {
                        url: 'user/logout',
                        method: 'POST',
                        body: {
                            userId: user._id
                        }
                    }
                );

                setUser(null);
                setToken(null);
                setExpiryDate(null);
                setCurrentChat(null);
                setNotifications(null);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('expiryDate');

            } else {
                localStorage.setItem('token', tokenParams);
                localStorage.setItem('user', JSON.stringify(userParams));


                if (miliseconds) {
                    const expiryDate = new Date(
                        new Date().getTime() + miliseconds
                    );
                    setExpiryDate(expiryDate);
                    localStorage.setItem('expiryDate', expiryDate.toISOString());
                }

                setUser(userParams);
                setToken(tokenParams);
            }
        } catch (e) {
            throw new Error('error during login');
        }
    }

    const chatContext = {
        user,
        currentChat,
        token,
        notifications,
        chats,
        expiryDate,
        setSession,
        setCurrentChat,
        setChats,
        setNotifications
    };

    return (
        <ChatContext.Provider value={chatContext}>
            {children}
        </ChatContext.Provider>
    )
};

export default ChatProvider;
