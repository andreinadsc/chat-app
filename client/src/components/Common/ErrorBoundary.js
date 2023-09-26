import React from 'react';

import { Button, Typography, Box } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, errorInfo: error.toString() };
    }

    componentDidCatch(error, errorInfo) {
        console.log(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '2rem',
                        alignItems: 'center',
                        flexDirection: 'column',
                        minHeight: '100vh',
                        backgroundColor: 'primary.secondary',
                    }}
                >
                    <ErrorIcon sx={{ fontSize: 100 }} />
                    <Typography variant='h1'>
                        Something went wrong
                    </Typography>
                    <Typography variant='h6'>
                        {this.state.errorInfo}
                    </Typography>
                    <Button variant='contained' href='/'>
                        Try Again
                    </Button>
                </Box>

            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
