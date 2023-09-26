import { useContext, useEffect, useState } from 'react';

import {
    Card,
    Box,
    TextField,
    Autocomplete,
    Chip,
    Avatar,
    InputLabel,
    Typography,
    Modal
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import CloseIcon from '@mui/icons-material/Close';
import InputEmoji from 'react-input-emoji'

import ChatContext from '../../context/chat-context';
import ErrorBox from '../Common/ErrorBox';
import useHttp from '../../hooks/https';

import classes from './Modal.module.css';

const NewGroupModal = ({ children }) => {
    const { token, setChats, setCurrentChat } = useContext(ChatContext);
    const { isLoading, error, sendRequest } = useHttp();

    const [open, setOpen] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [groupName, setGroupName] = useState('');

    useEffect(() => {
        sendRequest(
            {
                url: 'user',
                token: token
            },
            (data) => setAllUsers(data)
        );
    }, [sendRequest, token]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.target.parentElement;

        sendRequest(
            {
                url: 'chats/group/create',
                token: token,
                method: 'POST',
                body: {
                    users: JSON.stringify(selectedOptions.map(option => option._id)),
                    groupName: groupName,
                    picture: form.querySelector('#picture').files[0]
                }
            },
            (data) => {
                setChats(prev => [...prev, data]);
                setCurrentChat(data);
                setOpen(false);
            }
        );
    };

    return (
        <>
            <span onClick={() => setOpen((true))}>{children}</span>
            <Modal open={open} onClose={() => setOpen(false)} >
                <Card className={classes.modalBox}>
                    <CloseIcon className={classes.icon} onClick={() => setOpen(false)} sx={{m: 2}} />
                    <Typography component='h1' variant='h5' align='center' padding={2} >
                        Create Group Chat
                    </Typography>
                    <Box className={`${classes['container-fields']} ${classes['new-group']}`} component='form' encType='multipart/form-data'>
                        <InputEmoji
                            value={groupName}
                            onChange={(text) => setGroupName(text)}
                            placeholder='Name'
                            fontSize={10}
                            fontFamily='inherit'
                        />
                        {allUsers.length > 0 &&
                            <Autocomplete className={classes.fields}
                                sx={{ '& fieldset': { border: 'none' } }}
                                multiple
                                disableClearable
                                options={allUsers}
                                limitTags={2}
                                isOptionEqualToValue={(option, value) => value._id === option._id}
                                getOptionLabel={(option) => option.name}
                                onChange={(event, values) => setSelectedOptions(values)}
                                renderTags={(options, getTagProps) => {
                                    return (
                                        options.map((option, index) =>
                                            <Chip key={option._id}
                                                avatar={<Avatar alt={option.name} src={`http://localhost:8080/${option.picture}`} />}
                                                label={option.name}
                                                variant='outlined'
                                                {...getTagProps({ index })}
                                            />
                                        )
                                    )
                                }}
                                renderOption={(props, option) => (
                                    <Chip key={option._id}
                                        avatar={<Avatar alt={option.name} src={`http://localhost:8080/${option.picture}`} />}
                                        label={option.name}
                                        variant='outlined'
                                        {...props}
                                    />
                                )}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label='Choose a friend to start chatting'
                                    />
                                )}
                            />
                        }
                        <Box className={classes['container-fields']}>
                            <InputLabel>Add a group image</InputLabel>
                            <TextField
                                sx={{ '& fieldset': { border: 'none' } }}
                                className={classes.fields}
                                fullWidth
                                name='picture'
                                id='picture'
                                type='file'
                                accept='image/jpeg, image/png, image/jpg'
                            />
                        </Box>
                        <LoadingButton loading={isLoading} onClick={handleSubmit} variant='contained' type='submit' fullWidth sx={{ mt: 3, mb: 2 }}>
                            Create New Group
                        </LoadingButton>
                        {
                            error && <ErrorBox error={error} title='Something went wrong while creating the new chat' />
                        }
                    </Box>
                </Card>
            </Modal>
        </>

    );
}

export default NewGroupModal;
