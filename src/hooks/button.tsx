import { useState, useCallback } from 'react';

function useSubmit(): [boolean, (submitFunction: () => Promise<void>) => Promise<void>] {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = useCallback(async (submitFunction: () => Promise<void>) => {
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            await submitFunction();
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsSubmitting(false);
        }
    }, [isSubmitting]);

    return [isSubmitting, handleSubmit];
}

export default useSubmit;