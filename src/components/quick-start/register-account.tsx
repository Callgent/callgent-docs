import useIsBrowser from '@docusaurus/useIsBrowser';
import styles from './index.module.css';
import React, { useState } from 'react';
import useSubmit from '@site/src/hooks/button';
import axios from 'axios';

const RegisterAccount = () => {
    const isBrowser = useIsBrowser();
    if (!isBrowser) { return null; }
    const [isSubmitting, handleSubmit, message] = useSubmit();

    const submitFunction = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const body = {
            email: email,
            create: true,
            resetPwd: true,
        }
        await axios.post('/api/users/send-confirm-email', body).then(req => {
            const { data } = req;
            localStorage.setItem('callgent', JSON.stringify(data))
        }).catch(error => {
            const { data } = error.response;
            throw new Error(JSON.stringify(data.message));
        });
    }

    return (
        <>
            <form onSubmit={(e) => handleSubmit(() => submitFunction(e), false)} className={styles.form}>
                <input
                    type="email"
                    name="email"
                    required
                    placeholder="Enter your email to register"
                    className='input col col--4 margin--sm table-of-contents'
                />
                <button
                    type="submit"
                    className='button col col--3 margin--sm button--info button--secondary'
                    disabled={isSubmitting}
                >
                    Send Email
                </button>
            </form>
            {message === true && <span className="margin--md text--success">Please check your email to confirm registration!</span>}
            {message !== true && message !== null && <span className="margin--md text--danger">{message}</span>}
        </>
    );
};
export default RegisterAccount;