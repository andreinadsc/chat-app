import { useContext, useState, useEffect } from 'react';

import {
    Modal,
    Card,
    CardContent,
    TextField,
    Autocomplete,
    Chip,
    Avatar,
    CardActions,
    Divider,
    Typography,
    CardMedia,
    Tooltip
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Logout, Close, Visibility, CheckCircle } from '@mui/icons-material/';

import ChatContext from '../../context/chat-context';
import useHttp from '../../hooks/https';

import ErrorBox from '../Common/ErrorBox';
import ChildModal from './ChildModal';

import { socket } from '../../utils/socket';

import classes from './Modal.module.css';

const UpdateGroupModal = () => {
    const { currentChat, token, setCurrentChat, setChats, user } = useContext(ChatContext);
    const { isLoading, error, sendRequest } = useHttp();

    const [open, setOpen] = useState(false);
    const [allUsers, setAllUsers] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState([]);

    const [groupChatName, setGroupChatName] = useState(currentChat.chatName);
    const [groupPicture, setGroupPicture] = useState(null);

    useEffect(() => {
        sendRequest(
            {
                url: 'user',
                token: token
            },
            (data) => setAllUsers(data)
        );

        setSelectedOptions(currentChat.users);
    }, [currentChat.users, open, sendRequest, token]);

    const handleUpdateFields = async (id) => {
        let updateField;

        if (id === 'picture' && groupPicture) updateField = { picture: groupPicture };
        if (id === 'chatName' && groupChatName && groupChatName !== currentChat.chatName) updateField = { newGroupName: groupChatName };

        sendRequest(
            {
                url: 'chats/group/update',
                method: 'PUT',
                token: token,
                body: {
                    chatId: currentChat._id,
                    ...updateField
                }
            },
            (data) => {
                setChats(prev => {
                    const originalState = [...prev];
                    const index = prev.findIndex(item => item._id === data._id);
                    originalState[index] = data;
                    return originalState;
                });

                socket.emit('update chat', data, user._id);
                setCurrentChat(data);
                setGroupChatName('');
                setGroupPicture(null);
            }
        );
    };

    const handleUpdateUsers = async () => {
        if (JSON.stringify(selectedOptions) !== JSON.stringify(currentChat.users)) {
            sendRequest(
                {
                    url: 'chats/group/users',
                    method: 'PUT',
                    token,
                    body: {
                        chatId: currentChat._id,
                        users: JSON.stringify(selectedOptions.map(option => option._id))
                    }
                },
                (data) => {
                    setCurrentChat(data);
                    setSelectedOptions([]);
                    setChats(prev => {
                        const originalState = [...prev];
                        const index = prev.findIndex(item => item._id === data._id);
                        originalState[index] = data;
                        return originalState;
                    });
                    socket.emit('update chat', data, user._id);
                }
            );
        }
    };

    const handleLeave = async () => {
        const filteredUsers = currentChat.users.filter(item => item._id !== user._id).map(user => user._id);

        sendRequest(
            {
                url: 'chats/group/users',
                method: 'PUT',
                token,
                body: {
                    chatId: currentChat._id,
                    users: JSON.stringify(filteredUsers),
                    groupAdmin: filteredUsers[Math.floor(Math.random() * filteredUsers.length)],
                    isLeaving: true
                }
            },
            (data) => {
                setCurrentChat(null);
                setChats(prev => prev.filter(item => item._id !== data._id));
                setOpen(false);
                socket.emit('update chat', data, user._id);
            });
    };

    return (
        <>
            {currentChat.chatName && allUsers &&
                <>
                    <Visibility className={classes.icon} sx={{ color: 'primary.secondary' }} onClick={() => setOpen(true)} />
                    <Modal open={open} onClose={() => setOpen(false)} >
                        <Card className={classes.modalBox}>
                            <Close className={classes.icon} onClick={() => setOpen(false)} sx={{m: 2}} />
                            <div className={classes.media}>
                                <CardMedia
                                    component='img'
                                    height={250}
                                    width={250}
                                    image={`http://localhost:8080/${currentChat.groupPicture}`}
                                    alt={currentChat.chatName}
                                />
                                <ChildModal handleUpdate={handleUpdateFields} picture={currentChat.groupPicture} id='picture' type='file' func={setGroupPicture} title='Update Group Icon' />
                            </div>
                            <Typography variant='h4' component='div' sx={{ flexGrow: 1, pt: 3, pb: 1 }} align='center'>
                                {currentChat.chatName}
                                <ChildModal handleUpdate={handleUpdateFields} id='chatName' type='text' func={setGroupChatName} title='Update Group Name' name={groupChatName} />
                            </Typography>
                            <Divider textAlign='center'>Group • {currentChat.users.length} participants</Divider>
                            <CardContent sx={{ pt: 3, position: 'relative' }} >
                                <Autocomplete
                                    sx={{textAlign: 'center'}}
                                    noOptionsText='No users found. Please try again later'
                                    multiple
                                    fullWidth
                                    disableClearable
                                    isOptionEqualToValue={(option, value) => value._id === option._id}
                                    onChange={(event, values) => setSelectedOptions(values)}
                                    options={[...allUsers, user]}
                                    value={selectedOptions}
                                    getOptionLabel={(option) => option._id}
                                    renderTags={(options, getTagProps) => {
                                        return (
                                            options.map((option, index) =>
                                                <Chip key={option._id}
                                                    avatar={<Avatar alt={option.name} src={`http://localhost:8080/${option.picture}`} />}
                                                    label={option._id === currentChat.groupAdmin._id ? `${option.name} (Admin)` : option.name}
                                                    variant='outlined'
                                                    {...getTagProps({ index })}
                                                    disabled={option._id === currentChat.groupAdmin._id}
                                                />
                                            )
                                        )
                                    }}
                                    renderOption={(props, option) => (
                                        <Chip key={option._id}
                                            avatar={<Avatar alt={option.name} src={`http://localhost:8080/${option.picture}`} />}
                                            label={option._id === currentChat.groupAdmin._id ? `${option.name} (Admin)` : option.name}
                                            variant='outlined'
                                            disabled={option._id === currentChat.groupAdmin._id}
                                            {...props}
                                        />
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            onChange={(e) => setSelectedOptions(e.target.value)}
                                            {...params}
                                            label='Update chat participants'
                                        />
                                    )}
                                />

                                <Tooltip title="Click after add or remove participants">
                                    <CheckCircle className={classes.icon} fontSize="large" onClick={handleUpdateUsers} sx={{ color: 'primary.main', position: 'absolute', top: '96%', left: '86%' }} />
                                </Tooltip>
                            </CardContent>
                            <CardActions>
                                <LoadingButton
                                    loading={isLoading}
                                    loadingPosition='start'
                                    onClick={handleLeave}
                                    startIcon={<Logout />}
                                    variant='outlined'
                                >
                                    Leave Group
                                </LoadingButton>
                            </CardActions>
                            {
                                error && <ErrorBox error={error} title='We were unable to update the group chat' />
                            }
                        </Card>
                    </Modal>
                </>
            }
        </>
    );
};

export default UpdateGroupModal;
