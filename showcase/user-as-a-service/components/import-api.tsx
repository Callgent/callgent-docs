import useIsBrowser from '@docusaurus/useIsBrowser';
import styles from './index.module.css';
import React, { useEffect, useRef, useState } from 'react';
import { DocType } from '@site/src/types/user';
import { useSelector, useDispatch } from 'react-redux';
import useSubmit from '@site/src/hooks/button';

const ImportApi = () => {
    const isBrowser = useIsBrowser();
    if (!isBrowser) { return null; }
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const dispatch = useDispatch();
    const [importState, setImportState] = useState<boolean | string | null>(null);
    const { token } = useSelector(
        (state: DocType) => state.user
    );
    const [isSubmitting, handleSubmit] = useSubmit();

    const handleImport = async () => {
        const { setShowLogin } = require('@site/src/store/slices/userSlice');
        const { importCallgentFunctions } = require('@site/src/store/thunk');
        if (!token) {
            dispatch(setShowLogin(true));
            return;
        }

        await handleSubmit(async () => {
            const req = await dispatch(importCallgentFunctions({ text: textareaRef.current?.value || '' }));
            const { data } = req.payload;
            if (!data) {
                setImportState(req.payload);
            } else {
                setImportState(true);
            }
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
            <button
                style={{ textAlign: 'center' }}
                onClick={handleImport}
                className="button col col--2 button--info button--secondary"
                disabled={isSubmitting}
            >
                Import
            </button>
            {importState === true && <span className="margin--md text--success">Import successful!</span>}
            {importState !== true && importState !== null && <span className="margin--md text--danger">{importState}</span>}
        </div>
    );
};

export default ImportApi;