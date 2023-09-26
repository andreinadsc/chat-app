import { useState, useEffect, useRef, useContext } from 'react';
import { Drawer, InputBase, IconButton, Box, useMediaQuery, Divider } from '@mui/material';

import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';

import ChatContext from '../../context/chat-context';

import UserCard from './UserCard';
import useHttp from '../../hooks/https';

const Search = styled('div')(({ theme }) => ({
    display: 'flex',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: '#E5E5E5',
    '&:hover': {
        backgroundColor: '#F7F7F8'
    }
}));

const SearchWrapper = () => {
    const isMobile = useMediaQuery((theme) => theme.breakpoints.between('xs', 'sm'));

    const { token } = useContext(ChatContext);
    const { sendRequest } = useHttp();

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [searchFilter, setSearchFilter] = useState('');

    const inputRef = useRef();

    useEffect(() => {
        const getFilterSearch = async () => {
            if (searchFilter.length === 0) return;

            await sendRequest(
                {
                    url: `user/?search=${searchFilter}`,
                    token: token
                },
                (data) => setAllUsers(data)
            );
        };

        let timeout = setTimeout(() => {
            if (searchFilter === inputRef?.current?.value) getFilterSearch();
        }, 500);

        return () => clearTimeout(timeout);
    }, [searchFilter, inputRef, sendRequest, token]);

    const toggleSearch = (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) return;
        setIsSearchOpen(prev => !prev);
    };

    return (
        <>
            <Search>
                {
                    !isMobile &&
                    <InputBase
                        onClick={toggleSearch}
                        onChange={event => setSearchFilter(event.target.value)}
                        sx={{ ml: 1, width: '30rem' }}
                        placeholder='Search…'
                    />
                }
                <IconButton onClick={toggleSearch}>
                    <SearchIcon color='primary' />
                </IconButton>
            </Search>
            <Drawer open={isSearchOpen} onClose={toggleSearch} disableRestoreFocus
                PaperProps={{
                    sx: {
                        width: {
                            xs: 250,
                            sm: 350
                        },
                        backgroundColor: 'primary.main',
                    }
                }}>
                <Box display='flex'>
                    <InputBase
                        inputRef={inputRef}
                        onChange={event => setSearchFilter(event.target.value)}
                        autoFocus
                        sx={{ ml: 1, flex: 1 }}
                        placeholder='Search…'
                        inputProps={{
                            sx: {
                                color: 'primary.secondary',
                                pl: 2
                            }
                        }}
                    />
                    <IconButton>
                        <SearchIcon sx={{ color: 'primary.secondary' }} />
                    </IconButton>
                </Box>
                <Divider variant='middle' sx={{ borderColor: 'primary.secondary' }} />
                {
                    allUsers?.map(user => <UserCard key={user._id} user={user} closeSearch={setIsSearchOpen} />)
                }
            </Drawer>
        </>
    );
};

export default SearchWrapper;
