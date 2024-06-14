import useIsBrowser from '@docusaurus/useIsBrowser';
import useSubmit from '@site/src/hooks/button';
import styles from './index.module.css';
import React, { useState, useRef } from 'react';
import axios from 'axios';

const CreateCallgent = () => {
    const isBrowser = useIsBrowser();
    if (!isBrowser) { return null; }
    const [importState, setImportState] = useState<boolean | string | null>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const [isSubmitting, handleSubmit] = useSubmit();
    const submitFunction = async () => {
        const formData = new FormData(formRef.current);
        const formValues = Object.fromEntries(formData.entries()) as { name: string };
        try {
            const req = await axios.post('/api/callgents', formValues);
            const { data } = req.data;
            localStorage.setItem('callgent', JSON.stringify(data));
            const storageEvent = new Event('localStorageChange');
            window.dispatchEvent(storageEvent);
            setImportState(true);
        } catch (error) {
            const { data } = error.response;
            setImportState(data.message);
        }
    };

    return (
        <form ref={formRef} className={styles.form}>
            <input
                type="text"
                name="name"
                placeholder="ddd"
                className="input col col--4 margin--sm table-of-contents"
            />
            <button
                type="submit"
                className="button col col--2 margin--sm button--info button--secondary"
                onClick={() => handleSubmit(submitFunction)}
                disabled={isSubmitting}
            >
                Create
            </button>
            {importState === true && <span className="margin--md text--success">Successfully created!</span>}
            {importState !== true && importState !== null && <span className="margin--md text--danger">{importState}</span>}
        </form>
    );
};

export default CreateCallgent;