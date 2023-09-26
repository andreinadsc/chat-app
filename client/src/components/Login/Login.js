import Input from '../Common/Input';

const Login = ({ formInputs, dispatch }) => {
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
        helperText='Your password is invalid'
        data={formInputs}
        dispatch={dispatch}
        inputProps={true}
      />
    </>
  );
}

export default Login;
