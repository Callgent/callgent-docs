import React, { useRef, useEffect } from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';
import styles from './styles.module.css';

const TextArea = ({ value, onChange, ...props }) => {
    const isBrowser = useIsBrowser();
    if (!isBrowser) return;

    const textareaRef = useRef(null);
    useEffect(() => {
        const textarea = textareaRef.current;
        const handleInput = () => {
            textarea.style.height = 'auto';
            textarea.style.height = Math.min(textarea.scrollHeight, 100) + 'px';
        };
        textarea.addEventListener('input', handleInput);
        return () => {
            textarea.removeEventListener('input', handleInput);
        };
    }, [isBrowser]);

    if (!isBrowser) {
        return null;
    }

    return (
        <textarea
            className={styles.customTextarea}
            ref={textareaRef}
            value={value}
            onChange={onChange}
            {...props}
        />
    );
};

export default TextArea;