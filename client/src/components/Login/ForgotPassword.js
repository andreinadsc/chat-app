import Input from '../Common/Input';

const ForgotPassword = ({ formInputs, dispatch }) => {
    return (
        <>
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
        </>
    );
}

export default ForgotPassword;
