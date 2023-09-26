import { createContext } from 'react';

const ChatContext = createContext({
    user: null,
    currentChat: null,
    chats: [],
    notifications: [],
    token: null,
    expiryDate: null,
    setChats: (chats) => {},
    setSession: (user, token, miliseconds) => {},
    setCurrentChat: (chat) => {},
    setNotifications: (notification) => {}
});

export default ChatContext;
