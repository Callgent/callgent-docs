import React, { useEffect, useRef, useState } from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';
import { getCookie } from '@site/src/util/cookie';
import useSubmit from '@site/src/hooks/button';
import styles from './index.module.css';
import axios from 'axios';

const ImportApi = () => {
    const isBrowser = useIsBrowser();
    if (!isBrowser) { return null; }
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [importState, setImportState] = useState<boolean | string | null>(null);
    const [isSubmitting, handleSubmit, message] = useSubmit();

    const submitFunction = async () => {
        const body = {
            entryId: "HDr6wTsLJ45CY4yq2bgIt",
            text: textareaRef.current?.value || '',
            format: "openAPI"
        }
        await axios.post('/api/callgent-functions/import', body).then(req => {
            setImportState(true);
        }).catch(error => {
            const { data } = error.response;
            throw new Error(JSON.stringify(data.message));
        });
    };

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            const handleInput = () => {
                textarea.style.height = 'auto';
                textarea.style.height = Math.min(textarea.scrollHeight, 100) + 'px';
            };
            textarea.addEventListener('input', handleInput);
            return () => {
                textarea.removeEventListener('input', handleInput);
            };
        }
    }, []);

    return (
        <div className={styles.importSection}>
            <textarea className={styles.customTextarea} ref={textareaRef}></textarea>
            {/* <button
                style={{ textAlign: 'center' }}
                onClick={() => handleSubmit(submitFunction)}
                className="button col col--2 button--info button--secondary"
                disabled={isSubmitting}
            >
            </button> */}
            {/* Import
            </button>
            {importState === true && <span className="margin--md text--success">Import successful!</span>}
            {importState !== true && importState !== null && <span className="margin--md text--danger">{importState}</span>} */}
        </div>
    );
};

export default ImportApi;
