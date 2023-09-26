import Avatar from '@mui/material/Avatar';

import classes from './Message.module.css';

export const MessageLeft = ({message, displayName, timestamp, photoURL}) => {
    return (
        <>
            <div className={classes.messageRow}>
                <Avatar alt={displayName} src={photoURL} />
                <div>
                    <div className={classes.displayName}>{displayName}</div>
                    <div className={classes.messageSender}>
                        <div>
                            <p className={classes.messageContent}>{message}</p>
                        </div>
                        <span className={classes.messageTimeStampRight}>{timestamp}</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export const MessageRight = ({message, timestamp}) => {
    return (
        <div className={classes.messageRowRight}>
            <div className={classes.messageReciever}>
                <p className={classes.messageContent}>{message}</p>
                <span className={classes.messageTimeStampRight}>{timestamp}</span>
            </div>
        </div>
    );
};
