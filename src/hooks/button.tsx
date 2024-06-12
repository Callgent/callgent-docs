import { useState, useCallback, useContext } from 'react';
import { GlobalContext } from '@site/src/context/GlobalContext';
import { getCookie } from '../util/cookie';

function useSubmit(): [boolean, (submitFunction: () => Promise<void>, requireLogin?: boolean) => Promise<void>] {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { setShowLogin } = useContext(GlobalContext);

    const handleSubmit = useCallback(async (submitFunction: () => Promise<void>, requireLogin: boolean = true) => {
        if (requireLogin && !getCookie('x-callgent-jwt')) {
            setShowLogin(true);
        }
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            await submitFunction();
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsSubmitting(false);
        }
    }, [isSubmitting, setShowLogin]);
    return [isSubmitting, handleSubmit];
}

export default useSubmit;