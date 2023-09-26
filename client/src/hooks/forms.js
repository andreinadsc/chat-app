import { useReducer } from 'react';
import validator from 'validator';

const validateFunctions = (key, value) => {
    switch (key) {
        case 'fullName': return value.trim().length >= 4;
        case 'email': return validator.isEmail(value);;
        case 'password':
            return validator.isStrongPassword(value, {
                minLength: 8, minLowercase: 1,
                minUppercase: 1, minNumbers: 1, minSymbols: 1
            });
        case 'confirmPassword': return validator.equals(value.confirmPassword, value.password);
        case 'picture': return value !== undefined && (value.type === 'image/jpeg' || value.type === 'image/png' || value.type === 'image/jpg');
        default: return;
    }
};

const formReducer = (state, action) => {
    let isValid;

    switch (action.type) {
        case 'UPDATE':
            state.init[action.key] = action.value;
            return { ...state };
        case 'VALIDATE':
            if (action.key === 'confirmPassword')
                isValid = validateFunctions(action.key, { confirmPassword: action.value, password: state.init.password })
            else
                isValid = validateFunctions(action.key, action.value)

            state.validate[action.key] = !isValid;
            return { ...state };
        case 'SHOW_PASSWORD':
            state.showPassword[action.key] = !action.value;
            return { ...state };
        default:
            return { ...state };
    }
};


const useForm = (type, object) => {
    const initialValues = {
        init: {
            fullName: '',
            password: '',
            confirmPassword: '',
            email: '',
            picture: ''
        },
        validate: {
            fullName: false,
            password: false,
            confirmPassword: false,
            email: false,
            picture: false
        },
        showPassword: {
            password: true,
            confirmPassword: true
        },
        isFormValid: false
    };

    const [formInputs, setFormInputs] = useReducer(formReducer, initialValues);

    formInputs.isFormValid =
        ((type === 'login' && (formInputs.init.email !== '' && formInputs.init.password !== ''))
            ||
            (type === 'signup' && (formInputs.init.fullName !== '' && formInputs.init.email !== '' && formInputs.init.password !== '' && formInputs.init.confirmPassword !== '' && formInputs.init.picture !== ''))
            ||
            (type === 'password' && (formInputs.init.confirmPassword !== '' && formInputs.init.password !== '')))
        && (!formInputs.validate.fullName && !formInputs.validate.email && !formInputs.validate.password && !formInputs.validate.confirmPassword && !formInputs.validate.picture);

    const dispatch = (type, key, value) => {
        if (key === 'picture') {
            setFormInputs({ type: 'VALIDATE', key, value })
        }
        setFormInputs({ type, key, value });

    };

    return {
        formInputs,
        dispatch
    }
};

export default useForm;
