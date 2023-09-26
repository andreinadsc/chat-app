import { useState, useCallback } from 'react';

const useHttp = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const sendRequest = useCallback(async (requestConfig, applyDataFn) => {
        let formData = {};
        setIsLoading(true);
        setError(null);

        if (requestConfig.body) {
            const { body } = requestConfig;
            formData = new FormData();
            for (const key in body) {
                formData.append(key, body[key]);
            }
        }
        try {
            const response = await fetch(`https://chat-app-nbgl.onrender.com/${requestConfig.url}`, {
                method: requestConfig?.method || 'GET',
                headers: requestConfig?.token ? { 
                    'Authorization': `Bearer ${requestConfig.token}`
                } : {},
                body: requestConfig.body ? formData : null
            });

            const json = await response.json();


            if (!response.ok) {
                throw new Error(json?.message?.toString() || new Error('Request Failed'));
            }

            applyDataFn(json);
        } catch (err) {
            setError(err?.message || err || 'Something went wrong!');
        }
        setIsLoading(false);
    }, []);

    return { isLoading, error, sendRequest };
};

export default useHttp;
