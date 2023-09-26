import { io } from 'socket.io-client';

const URL = 'https://chat-app-nbgl.onrender.com';

export const socket = io(URL);
