import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    Badge,
    Button,
    Avatar,
    Menu,
    MenuItem,
    Divider,
    useMediaQuery
} from '@mui/material';
import { Notifications, ArrowDropDown, Logout } from '@mui/icons-material';

import ChatContext from '../../context/chat-context';
import useHttp from '../../hooks/https';
import getSender from '../../utils/chatLogics';

import SearchWrapper from './SearchWrapper';
import ProfileModal from '../Modals/ProfileModal';


const Header = ({ handlerNotificationClick }) => {
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

    const [menuOption, setMenuOption] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);

    const navigate = useNavigate();

    const { setSession, user, notifications, token, setNotifications } = useContext(ChatContext);
    const { sendRequest } = useHttp();

    const handleClick = (event) => setAnchorEl(event.currentTarget);

    const handleClose = () => setAnchorEl(null);

    const handleLogout = () => {
        setSession();
        navigate('/');
    };

    const handleMenuOpen = (event) => setMenuOption(event.currentTarget);

    const handleMenuClose = () => setMenuOption(null);

    useEffect(() => {
        if (!user && !token) return;
        sendRequest(
            {
                url: 'notifications',
                token: token
            },
            (data) => {
                setNotifications(data)
            }
        );
    }, [token, sendRequest, setNotifications, user]);


    return (
        <AppBar component='header' position='static' sx={{ backgroundColor: 'primary.secondary' }} >
            <Toolbar>
                <Typography variant='h4' component='h4'
                    sx={{
                        mr: 2,
                        fontWeight: 700,
                        fontFamily: 'monospace',
                        letterSpacing: '.3rem',
                        color: 'primary.main',
                        textTransform: 'uppercase'
                    }}
                >
                    Chatterland
                </Typography>
                {
                    user &&
                    <>
                        <SearchWrapper />
                        {!isMobile && <Box sx={{ flexGrow: 1 }} />}
                        <Box sx={{ display: 'flex', ml: 'auto' }}>
                            <IconButton onClick={handleClick} size='large'>
                                {
                                    <Badge badgeContent={notifications?.length > 0 ? notifications.length : 0} color='error'>
                                        <Notifications color='primary' />
                                    </Badge>
                                }
                            </IconButton>
                            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose} >
                                {
                                    !notifications || notifications?.length === 0 ?
                                        <span style={{ padding: '1rem' }}>No new messages</span>
                                        : notifications.map((notification) => (
                                            <MenuItem key={notification._id}
                                                onClick={() => {
                                                    handleClose();
                                                    handlerNotificationClick(notification.chat);
                                                }}
                                            >
                                                {
                                                    notification.chat?.isGroupChat
                                                        ? `New Message(s) in ${notification.chat.chatName}`
                                                        : `New Message from ${getSender(notification.chat.users, user).name}`
                                                }
                                            </MenuItem>
                                        ))
                                }
                            </Menu>
                            <Button onClick={handleMenuOpen} endIcon={<ArrowDropDown />}>
                                <Avatar alt={user.name}
                                    src={`http://localhost:8080/${user.picture}`}
                                    sx={{ width: 50, height: 50 }}
                                />
                            </Button>
                            <Menu
                                anchorEl={menuOption}
                                open={Boolean(menuOption)}
                                onClose={handleMenuClose}
                                slotProps={{
                                    paper: {
                                        sx: {
                                            overflow: 'visible',
                                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                            mt: 1.5,
                                            '& .MuiAvatar-root': {
                                                width: 20,
                                                height: 20,
                                                ml: -0.5,
                                                mr: 1,
                                            },
                                            '&:before': {
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                right: 14,
                                                width: 10,
                                                height: 10,
                                                bgcolor: 'background.paper',
                                                transform: 'translateY(-50%) rotate(45deg)'
                                            }
                                        }
                                    }
                                }}
                            >
                                <ProfileModal myProfile={true}>
                                    <MenuItem>
                                        <Avatar sx={{ bgcolor: 'primary.main' }} /> My Profile
                                    </MenuItem>
                                </ProfileModal>
                                <Divider sx={{ my: 0.5 }} />
                                <MenuItem onClick={handleLogout}>
                                    <Logout fontSize='small' sx={{ mr: 1 }} /> Logout
                                </MenuItem>
                            </Menu>
                        </Box>
                    </>
                }
            </Toolbar>
            <Divider variant='middle' />
        </AppBar>
    );
};

export default Header;
