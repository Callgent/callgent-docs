import useIsBrowser from '@docusaurus/useIsBrowser';
import styles from './index.module.css';
import { DocType } from '@site/src/types/user';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useSubmit from '@site/src/hooks/button';

const CreateCallgent = () => {
    const isBrowser = useIsBrowser();
    if (!isBrowser) {
        return null;
    }
    const { fetchCreateCallgent } = require('@site/src/store/thunk');
    const { setStatus } = require('@site/src/store/slices/userSlice');

    const [state, setState] = useState(false);
    const { status, token } = useSelector(
        (state: DocType) => state.user
    );
    const dispatch = useDispatch();

    const [lastSubmitTime, setLastSubmitTime] = useState(0);
    const [isSubmitting, handleSubmit] = useSubmit();

    const onFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const now = Date.now();
        if (now - lastSubmitTime < 5000) {
            return;
        }
        if (!token) {
            const { setShowLogin } = require('@site/src/store/slices/userSlice');
            dispatch(setShowLogin(true));
            return;
        }
        const formData = new FormData(event.currentTarget);
        const formValues = Object.fromEntries(formData.entries()) as { name: string };

        await handleSubmit(async () => {
            const req = await dispatch(fetchCreateCallgent(formValues));
            if (req.payload === "Failed to fetch users") {
                return;
            }
            setState(true);
            dispatch(setStatus({ isCreate: false }));
        });

        setLastSubmitTime(now);
    };

    return (
        <form onSubmit={onFormSubmit} className={styles.form}>
            <input
                type="text"
                name="name"
                required
                placeholder="Employee Leave Request"
                className="input col col--4 margin--sm table-of-contents"
            />
            <button
                type="submit"
                className="button col col--2 margin--sm button--info button--secondary"
                disabled={isSubmitting}
            >
                Create
            </button>
            {state && <span className="margin--md text--success">Successfully created!</span>}
            {status?.isCreate && <span className={styles.please}>Please create a callgent First!</span>}
        </form>
    );
};

export default CreateCallgent;