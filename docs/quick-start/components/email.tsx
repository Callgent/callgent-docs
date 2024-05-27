import useIsBrowser from '@docusaurus/useIsBrowser';
import styles from "./index.module.css";
import { DocType } from '@site/src/types/user';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
const Email = () => {
    
    const isBrowser = useIsBrowser();
    if (!isBrowser) {
        return null;
    }
    const { setCallgent, setStatus } = require('@site/src/store/slices/userSlice');
    const { callgent } = useSelector(
        (state: DocType) => state.user
    );
    const dispatch = useDispatch();
    useEffect(() => {
        // dispatch(setCallgent());
    }, [])
    // Mail Operations
    const pushRouter = () => {
        if (callgent?.uuid) {
            window.location.href = `mailto:callgent+${callgent.uuid}@c.callgent.com`;
        } else {
            const element = document.querySelector('#create-the-callgent');
            if (element instanceof HTMLElement) {
                window.scrollTo({
                    top: element.offsetTop - 60,
                    behavior: 'smooth'
                });
            }
            dispatch(setStatus({ isCreate: true }));
            const timerId = setTimeout(() => {
                dispatch(setStatus({ isCreate: false }));
            }, 3000);
            return () => clearTimeout(timerId);
        }
    }
    // console.log(callgent);

    return (
        <>
            <span onClick={pushRouter} className={styles.emailPush}>
                <svg width='20' className={styles.emailSvg} fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
                callgent+{callgent?.uuid || '**********'}@my.callgent.com
            </span>
        </>
    );
};

export default Email;