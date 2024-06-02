import useIsBrowser from '@docusaurus/useIsBrowser';
import styles from './index.module.css';
import { DocType } from '@site/src/types/user';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useSubmit from '@site/src/hooks/button';

const CreateEndpoints = () => {
    const isBrowser = useIsBrowser();
    if (!isBrowser) { return null; }
    const userinfo = JSON.parse(localStorage.getItem('userinfo'));
    const callgent = JSON.parse(localStorage.getItem('callgent'));
    const [state, setState] = useState(false)
    const { status, token } = useSelector(
        (state: DocType) => state.user
    );
    const dispatch = useDispatch();

    const [isSubmitting, handleSubmit] = useSubmit();
    const [importState, setImportState] = useState<boolean | string | null>(null);
    const [lastSubmitTime, setLastSubmitTime] = useState(0);
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
        const formValues = Object.fromEntries(formData.entries()) as { email: string };
        await handleSubmit(async () => {
            const data = {
                "type": 'SERVER',
                "host": formValues.email,
                "callgentUuid": callgent.uuid
            }
            const { uaaService } = require('@site/src/api/user-as-a-service');
            const api = uaaService();
            const req = await api.createEndpoints(data);
            if (req.message) {
                setImportState(req.message);
            } else {
                setImportState(true);
            }
        });
        setLastSubmitTime(now);
    };

    return (
        <form onSubmit={onFormSubmit} className={styles.form}>
            <input
                type="text"
                name="email"
                defaultValue={userinfo?.email ? userinfo.email : null}
                required
                placeholder="Please enter your email"
                className="input col col--4 margin--sm table-of-contents"
            />
            <button className="button col col--2 margin--sm button--info button--secondary" disabled={isSubmitting || !callgent?.uuid}>
                Create
            </button>
            {importState === true && <span className="margin--md text--success">Successfully created!</span>}
            {importState !== true && importState !== null && <span className="margin--md text--danger">{importState}</span>}
            {!callgent?.uuid && <span className={styles.please}>Please create a callgent First!</span>}
        </form>
    );
};
export default CreateEndpoints;