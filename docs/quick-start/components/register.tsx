import useIsBrowser from '@docusaurus/useIsBrowser';
import styles from './index.module.css';
import { DocType } from '@site/src/types/user';
import React, { useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

const CreateCallgent = () => {
    const isBrowser = useIsBrowser();
    if (!isBrowser) {
        return null;
    }
    const { sendConfirmEmail } = require('@site/src/store/thunk');
    const [state, setState] = useState(null);
    const dispatch = useDispatch();
    const onEmailSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const email = formData.get('email') as string;
        dispatch(sendConfirmEmail({ email }))
            .then((req) => {
                if (req.payload !== "Failed to send confirmation email") {
                    setState('success');
                } else {
                    setState('error');
                }
            });
    };
    return (
        <>
            <form onSubmit={(e) => onEmailSubmit(e)} className={styles.form}>
                <input
                    type="email"
                    name="email"
                    required
                    placeholder="Enter your email to register"
                    className='input col col--4 margin--sm table-of-contents'
                />
                <button className='button col col--3 margin--sm button--info button--secondary'>
                    Send Email
                </button>
            </form>
            {state === 'success' && <div className="text--success margin--sm">Please go to your email to set up your account!</div>}
            {state === 'error' && <div className="text--danger margin--sm">Failed to send confirmation email. Please try again later.</div>}
        </>
    );
};
export default CreateCallgent;