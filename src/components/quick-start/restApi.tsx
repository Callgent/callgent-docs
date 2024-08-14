import useIsBrowser from '@docusaurus/useIsBrowser';
import styles from './index.module.css';
import React, { useState } from 'react';
import { getCookie } from '@site/src/util/cookie';

const RestApi = () => {
    const isBrowser = useIsBrowser();
    if (!isBrowser) { return null; }
    const token = getCookie('x-callgent-jwt');

    const [copySuccess, setCopySuccess] = useState('');
    const [showToken, setShowToken] = useState(false);

    const start = `curl -X 'POST' \\
    'https://api.callgent.com/api/callgents/{uuid}//invoke/api/' \\
    -H 'accept: */*' \\
    `
    const end = `-H 'x-callgent-callback: https://callback-url-to-receive-task-response--or-empty-if-neednt-reply' \\
    -d '{
    "brief": "task brief or description",
    "content": { "any task content in JSON format": 1 },
    "from": "api",
    }'`
    const copyToClipboard = async () => {
        try {
            const data = start + `-H 'x-callgent-authorization: Bearer ${token}' \\
    ` + end
            await navigator.clipboard.writeText(data);
            setCopySuccess('Copied!');
        } catch (err) {
            setCopySuccess('Failed to copy!');
        }
    };

    // Function to toggle token visibility
    const toggleTokenVisibility = () => {
        setShowToken(!showToken);
    };
    const Authorization = showToken ? `-H 'x-callgent-authorization: ${token ? 'Bearer ' + token + ' \\' : 'Please Sign In first.'}'
    ` : <>-H 'x-callgent-authorization:<button onClick={toggleTokenVisibility}>Show the API Token</button>'<br />    </>
    return (
        <>
            <div>
                {copySuccess && <div className={styles.copy}>{copySuccess}</div>}
                <pre className={styles.pre}>
                    <div style={{ display: 'flex', textAlign: 'right' }}>
                        <button className={styles.copyButton} onClick={copyToClipboard}>Copy</button>
                    </div>
                    <code>{start}{Authorization}{end}</code>
                </pre>
            </div>
        </>
    );
};
export default RestApi;
