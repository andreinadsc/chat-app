import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const parseJwt = (token) => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
};

const AuthVerify = (props) => {
    let location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            const decodedJwt = parseJwt(token);

            if (decodedJwt.exp * 1000 < Date.now()) {
                props.logOut();
                navigate('/');

            }
        }
    }, [location, props, navigate]);

    return;
};

export default AuthVerify;
