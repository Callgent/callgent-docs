import useIsBrowser from '@docusaurus/useIsBrowser';
import useSubmit from '@site/src/hooks/button';
import styles from './index.module.css';
import React, { useState, useRef } from 'react';
import axios from 'axios';
import { TreeNodeType } from '@site/src/types/components';

interface CreateCallgentProps {
    name?: string;
    onDataReceived?: (data: TreeNodeType) => void;
}

const CreateCallgent: React.FC<CreateCallgentProps> = ({ name, onDataReceived }) => {
    const isBrowser = useIsBrowser();
    if (!isBrowser) { return null; }
    const [importState, setImportState] = useState<boolean | string | null>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const [isSubmitting, handleSubmit] = useSubmit();
    const submitFunction = async () => {
        const formData = new FormData(formRef.current);
        const formValues = Object.fromEntries(formData.entries()) as { name: string };
        try {
            const { data } = await axios.post('/api/bff/callgent-endpoints', formValues);
            if (onDataReceived) {
                onDataReceived(data.data);
            }
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
                placeholder="Callgent name"
                defaultValue={name}
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
