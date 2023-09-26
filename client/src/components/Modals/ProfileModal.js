import { useContext, useEffect, useState } from 'react';

import { Typography, Modal, CardMedia, Card, CardContent, Stack, Chip, Avatar, Button, Divider } from '@mui/material';
import { Logout, Close, Visibility } from '@mui/icons-material/';

import ChatContext from '../../context/chat-context';
import useHttp from '../../hooks/https';

import { socket } from '../../utils/socket';
import getSender from '../../utils/chatLogics';

import ChildModal from './ChildModal';

import classes from './Modal.module.css';

const ProfileModal = ({ myProfile, children }) => {
    const { currentChat, user, setCurrentChat, setChats, token, setSession } = useContext(ChatContext);
    const { sendRequest } = useHttp();

    const [modalUser, setModalUser] = useState([]);
    const [open, setOpen] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [username, setUsername] = useState(user.name);

    const mainPicture = currentChat?.isGroupChat && !myProfile ? currentChat.groupPicture : modalUser.picture;

    useEffect(() => {
        if (myProfile) setModalUser(user);
        else if (currentChat.isGroupChat) setModalUser(currentChat.users);
        else setModalUser(getSender(currentChat.users, user));

    }, [myProfile, currentChat, user]);

    const handleUpdateFields = async (id) => {
        let updateField;

        if (id === 'picture' && profilePhoto) updateField = { picture: profilePhoto };
        if (id === 'username' && username && username !== user.name) updateField = { newName: username };

        sendRequest(
            {
                url: 'user/update',
                method: 'PUT',
                token: token,
                body: {
                    ...updateField
                }
            },
            (data) => {
                setModalUser(data)
                setSession(data, token);
                setUsername('');
                setProfilePhoto(null);
            }
        )
    };

    const handleLeave = async () => {
        sendRequest(
            {
                url: 'chats/group/users',
                method: 'PUT',
                token,
                body: {
                    chatId: currentChat._id,
                    users:
                        JSON.stringify(currentChat.users.filter(item => item._id !== user._id).map(user => user._id)),
                    isLeaving: true
                }
            },
            (data) => {
                socket.emit('update chat', data, user._id);
                setCurrentChat(null);
                setChats(prev => prev.filter(item => item._id !== data._id));
                setOpen(false);
            });
    };

    return (
        <>
            {
                children ? (
                    <span onClick={() => setOpen(true)}>{children}</span>
                ) : (
                    <Visibility className={classes.icon} sx={{ color: 'primary.secondary' }} onClick={() => setOpen(true)} />
                )
            }
            {
                modalUser &&
                <Modal open={open} onClose={() => setOpen(false)}>
                    <Card className={classes.modalBox}>
                        <Close className={classes.icon} onClick={() => setOpen(false)} sx={{ m: 2 }} />
                        <div className={classes.media}>
                            <CardMedia
                                component='img'
                                height={250}
                                width={250}
                                image={`http://localhost:8080/${mainPicture}`}
                                alt='profile pic'
                            />
                            {
                                myProfile &&
                                <ChildModal handleUpdate={handleUpdateFields} picture={user.picture}
                                    id='picture' func={setProfilePhoto} title='Update Your Photo' />
                            }
                        </div>
                        <Typography variant='h4' component='div' sx={{ flexGrow: 1, pt: 3, pb: 1 }} align='center'>
                            {currentChat?.isGroupChat && !myProfile ? currentChat.chatName : modalUser.name}
                            {
                                myProfile &&
                                <ChildModal handleUpdate={handleUpdateFields} id='username' func={setUsername}
                                    title='Change Your Name' name={username} />
                            }
                        </Typography>
                        {
                            currentChat?.isGroupChat && !myProfile &&
                            <Divider textAlign='center' variant='middle'>
                                Group • {currentChat.users.length} participants
                            </Divider>
                        }
                        <CardContent className={classes['container-fields']}>
                            {
                                modalUser.length > 1 ?
                                    <>
                                        <Stack spacing={2} >
                                            {
                                                modalUser.map(user => (
                                                    <Chip key={user._id}
                                                        avatar={<Avatar alt={user.name} src={`http://localhost:8080/${user.picture}`} />}
                                                        label={user._id === currentChat?.groupAdmin?._id ? `${user.name} (Admin)` : user.name}
                                                        variant='outlined'
                                                    />
                                                ))
                                            }
                                        </Stack>
                                        <Button
                                            onClick={handleLeave}
                                            startIcon={<Logout />}
                                            variant='outlined'
                                            sx={{ ml: '60%', mt: 2 }}
                                        >
                                            Leave Group
                                        </Button>
                                    </>
                                    : <Typography variant='h5' color='text.secondary'>
                                        Email: {modalUser.email}
                                    </Typography>
                            }
                        </CardContent>
                    </Card>
                </Modal>
            }

        </>
    );
};

export default ProfileModal;
