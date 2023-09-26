import { Grid, TextField, InputLabel } from '@mui/material';

import Input from '../Common/Input';

const Signup = ({ formInputs, dispatch }) => {
    return (
        <>
            <Input
                id='fullName'
                label='Full Name'
                helperText='Your name should be at leats 4 characters long'
                data={formInputs}
                autoFocus={true}
                dispatch={dispatch}
            />
            <Input
                id='email'
                label='Email'
                helperText='Please enter a valid email'
                data={formInputs}
                dispatch={dispatch}
            />
            <Input
                id='password'
                label='Password'
                helperText='Use At Least 8 Characters One Uppercase Letter One Lowercase Letter And One Number In Your Password'
                data={formInputs}
                dispatch={dispatch}
                inputProps={true}
            />
            <Input
                id='confirmPassword'
                label='Confirm Password'
                helperText='Please make sure your passwords match'
                data={formInputs}
                dispatch={dispatch}
                inputProps={true}
            />
            <Grid item xs={12}>
                <InputLabel>Upload your picture</InputLabel>
                <TextField
                    required
                    fullWidth
                    name='picture'
                    id='picture'
                    type='file'
                    accept='image/jpeg, image/png, image/jpg'
                    error={formInputs.validate.picture}
                    helperText={formInputs.validate.picture ? 'Please make sure your profile picture is valid' : null}
                    onChange={(e) => dispatch('UPDATE', 'picture', e.target.files[0])}
                />
            </Grid>
        </>
    );
}

export default Signup;
