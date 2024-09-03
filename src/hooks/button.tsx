import { useState, useCallback, useContext } from 'react';
import { GlobalContext } from '@site/src/context/GlobalContext';
import { getCookie } from '../util/cookie';

function useSubmit(): [
    boolean,
    (submitFunction: () => Promise<void>, requireLogin?: boolean) => Promise<void>, string | null | boolean
] {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<string | null | boolean>(null);
    const { setShowLogin } = useContext(GlobalContext);

    const handleSubmit = useCallback(async (submitFunction: () => Promise<void>, requireLogin: boolean = true) => {
        if (requireLogin && !getCookie('x-callgent-jwt')) {
            setShowLogin(true);
        }
        if (isSubmitting) return;
        setIsSubmitting(true);
        setMessage(null);
        try {
            await submitFunction();
            setMessage(true);
        } catch (error: any) {
            if (Array.isArray(JSON.parse(error.message))) {
                setMessage(JSON.parse(error.message)[0]);
            } else if (typeof error.message === 'string') {
                setMessage(JSON.parse(error.message));
            } else {
                setMessage('An unknown error occurred');
            }
        } finally {
            setIsSubmitting(false);
        }
    }, [isSubmitting, setShowLogin]);
    return [isSubmitting, handleSubmit, message];
}

export default useSubmit;
