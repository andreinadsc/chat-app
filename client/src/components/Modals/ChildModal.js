import { useState } from 'react';

import { Modal, TextField, Button, Card } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import InputEmoji from 'react-input-emoji'

import classes from './Modal.module.css';

const ChildModal = ({ id, title, name, func, handleUpdate }) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <EditIcon className={`${classes.icon} ${id === 'picture' && classes['media-edit']}`} onClick={handleOpen} />
            <Modal open={open} onClose={handleClose}>
                <Card className={classes.modalBox} sx={{width: '30rem'}}>
                    {
                        id === 'picture' ?
                            <TextField
                                sx={{ '& label': { mt: '-2rem' } }}
                                autoFocus
                                id={id}
                                name={id}
                                label={title}
                                type='file'
                                fullWidth
                                onChange={(event) => func(event.target.files[0])}
                                variant='standard'
                            />
                            :
                            <InputEmoji
                                value={name}
                                onChange={(text) => func(text)}
                                cleanOnEnter
                                onEnter={() => handleUpdate(id)}
                                placeholder='Name'
                                fontSize={10}
                            />
                    }

                    <Button variant='outlined' onClick={() => { handleUpdate(id); handleClose(); }} sx={{ mt: 2 }}>
                        Save
                    </Button>
                </Card>
            </Modal>
        </>
    );
}

export default ChildModal;
