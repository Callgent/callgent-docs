import useIsBrowser from '@docusaurus/useIsBrowser';
import styles from './index.module.css';
import React, { useEffect, useState } from 'react';
import useSubmit from '@site/src/hooks/button';
import axios from 'axios';

const CreateEndpoints = () => {
    const isBrowser = useIsBrowser();
    if (!isBrowser) { return null; }
    const userinfo = JSON.parse(localStorage.getItem('userinfo'));
    const [callgent, setCallgent] = useState(JSON.parse(localStorage.getItem('callgent')));
    const [isSubmitting, handleSubmit] = useSubmit();
    const [importState, setImportState] = useState<boolean | string | null>(null);
    const submitFunction = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const formValues = Object.fromEntries(formData.entries()) as { email: string };
        const data = {
            "type": 'SERVER',
            "host": formValues.email,
            "callgentUuid": callgent.id
        }
        await axios.post('/api/endpoints/email/callgents', data).then(req => {
            setImportState(true);
            localStorage.removeItem('callgent');
        }).catch(error => {
            const { data } = error.response;
            setImportState(data.message);
        });
    };

    useEffect(() => {
        const handleStorageChange = () => {
            const updatedCallgent = JSON.parse(localStorage.getItem('callgent'));
            setCallgent(updatedCallgent);
        };
        window.addEventListener('localStorageChange', handleStorageChange);
        return () => {
            window.removeEventListener('localStorageChange', handleStorageChange);
        };
    }, []);

    return (
        <form onSubmit={(e) => handleSubmit(() => submitFunction(e))} className={styles.form}>
            <input
                type="text"
                name="email"
                defaultValue={userinfo?.email ? userinfo.email : null}
                required
                placeholder="Please enter your email"
                className="input col col--4 margin--sm table-of-contents"
            />
            <button className="button col col--2 margin--sm button--info button--secondary" disabled={isSubmitting || !callgent?.id}>
                Create
            </button>
            {importState === true && <span className="margin--md text--success">Successfully created!</span>}
            {importState !== true && importState !== null && <span className="margin--md text--danger">{importState}</span>}
            {!callgent?.id && <span className={styles.please}>Please create a callgent First!</span>}
        </form>
    );
};
export default CreateEndpoints;