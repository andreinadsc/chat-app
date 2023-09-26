import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';

import Authentication from '../components/Login/Authentication';
import ChatContext from '../context/chat-context';

function HomePage() {
    const { user } = useContext(ChatContext);
    const [value, setValue] = useState('1');
    const navigate = useNavigate();

    const handleChange = (event, newValue) => setValue(newValue);

    useEffect(() => {
        if (user) navigate('/chats');
    }, [navigate, user]);

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '95vh' }}>
            <Box sx={{ width: '65vw', backgroundColor: '#fff', boxShadow: '0 0 5px 5px rgba(150, 98, 171, .4)', borderRadius: '.5rem' }}>
                <TabContext value={value}>
                    <TabList sx={{ borderBottom: 1, borderColor: 'divider' }} onChange={handleChange} indicatorColor='transparent' >
                        <Tab label='Sign In' value='1' />
                        <Tab label='SignUp' value='2' />
                        <Tab label='' value='3' disabled={true} sx={{ '& .MuiTabs-selected': { outline: 'none' } }} />
                    </TabList>

                    <TabPanel value='1'><Authentication type='login' title='Sign In' handleChange={handleChange} /></TabPanel>
                    <TabPanel value='2'><Authentication type='signup' title='Sign Up' handleChange={handleChange} /></TabPanel>
                    <TabPanel value='3'><Authentication type='password' title='Forgot your password?' handleChange={handleChange} /></TabPanel>
                </TabContext>
            </Box>
        </Box>

    );
};

export default HomePage;
