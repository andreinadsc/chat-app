import { Grid, TextField, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material/';

const Input = ({ id, label, helperText, data, dispatch, autoFocus = false, inputProps = false }) => {
    return (
        <Grid item xs={12}>
            {
                !inputProps && <TextField sx={{ width: '100%' }}
                    name={id}
                    required
                    fullWidth
                    autoFocus={autoFocus}
                    id={id}
                    label={label}
                    value={data.init[id]}
                    error={data.validate[id]}
                    helperText={data.validate[id] ? helperText : null}
                    onChange={(e) => dispatch('UPDATE', id, e.target.value)}
                    onBlur={() => dispatch('VALIDATE', id, data.init[id])}
                />
            }
            {
                inputProps && <TextField sx={{ width: '100%' }}
                    required
                    fullWidth
                    name={id}
                    label={label}
                    autoComplete='off'
                    type={data.showPassword[id] ? 'password' : 'text'}
                    id={id}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position='end'>
                                <IconButton
                                    aria-label='toggle password visibility'
                                    onClick={() => dispatch('SHOW_PASSWORD', id, data.showPassword[id])}
                                    onMouseDown={() => dispatch('SHOW_PASSWORD', id, data.showPassword[id])} >
                                    {data.showPassword[id] ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    value={data.init[id]}
                    error={data.validate[id]}
                    helperText={data.validate[id] ? helperText : null}
                    onChange={(e) => dispatch('UPDATE', id, e.target.value)}
                    onBlur={() => dispatch('VALIDATE', id, data.init[id])}
                />
            }
        </Grid>
    );
};

export default Input;