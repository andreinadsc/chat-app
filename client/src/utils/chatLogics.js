const getSender = (users, user) => {
    const sender = users?.filter(sender => sender._id !== user._id);
    return (sender && sender[0]) || null;
};

export default getSender;
