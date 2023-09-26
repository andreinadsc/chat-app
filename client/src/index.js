import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';

import './index.css';
import App from './App';

import ChatProvider from './context/ChatProvider';
import theme from './Theme';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChatProvider>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </ChatProvider>
  </React.StrictMode>
);
