import { Alert, Typography, Box } from '@mui/material';

const ErrorBox = ({ error, title }) => {
    return (
        <Alert severity='error' sx={{ alignItems: 'center', gap: '1rem', margin: 3 }}>
            <Box sx={{ flex: 1 }}>
                <Typography variant='h6'>{title}</Typography>
                <Typography>
                    {error}
                </Typography>
            </Box>
        </Alert>
    );
};

export default ErrorBox;
