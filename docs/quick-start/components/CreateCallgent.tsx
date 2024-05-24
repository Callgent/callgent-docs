import useIsBrowser from '@docusaurus/useIsBrowser';
import styles from './index.module.css';
import { DocType } from '@site/src/types/user';
import React, { useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const CreateCallgent = () => {
    const isBrowser = useIsBrowser();
    if (!isBrowser) {
        return null;
    }
    const { fetchCreateCallgent, sendConfirmEmail } = require('@site/src/store/thunk');
    const { setStatus } = require('@site/src/store/slices/userSlice');
    const { siteConfig } = useDocusaurusContext();
    
    const myElementRef = useRef(null);
    const [state, setState] = useState(false)
    const { status, token } = useSelector(
        (state: DocType) => state.user
    );
    const dispatch = useDispatch();
    
    const [lastSubmitTime, setLastSubmitTime] = useState(0);
    const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const now = Date.now();
        if (now - lastSubmitTime < 5000) {
            return;
        }
        if (!token) {
            myElementRef.current.style.display = 'block';
            return;
        }
        const formData = new FormData(event.currentTarget);
        const formValues = Object.fromEntries(formData.entries()) as { name: string };
        dispatch(fetchCreateCallgent(formValues)).then((req) => {
            if (req.payload === "Failed to fetch users") { return }
            setState(true);
            dispatch(setStatus({ isCreate: false }));
        });
        setLastSubmitTime(now);
    };
    const closeModel = () => {
        myElementRef.current.style.display = 'none';
    }
    const handleContentClick = (event: { stopPropagation: () => void; }) => {
        event.stopPropagation();
    };
    const onEmailSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const email = formData.get('email') as string;
        dispatch(sendConfirmEmail({ email }))
            .then((req) => {
                if (req.payload !== "Failed to send confirmation email") {
                    closeModel();
                }
            });
    };
    return (
        <>
            <div id="myModal" onClick={closeModel} ref={myElementRef} className={styles.modal}>
                <div className={styles.modalContent} onClick={handleContentClick}>
                    <form onSubmit={(e) => onEmailSubmit(e)} className={styles.resForm}>
                        <input
                            type="email"
                            name="email"
                            required
                            placeholder="Enter your email to register"
                            className='input col table-of-contents'
                        />
                        <button className='button col button--info button--secondary' style={{ marginTop: '10px' }}>
                            Send Email
                        </button>
                    </form>
                </div>
            </div>
            <form onSubmit={onFormSubmit} className={styles.form}>
                <input
                    type="text"
                    name="name"
                    required
                    placeholder="Callgent Name"
                    className="input col col--4 margin--sm table-of-contents"
                />
                <button className="button col col--2 margin--sm button--info button--secondary">
                    Create
                </button>
                {state && <span className="margin--md text--success">Successfully created!</span>}
                {status?.isCreate && <span className={styles.please}>Please create a callgent First!</span>}
            </form>
        </>
    );
};
export default CreateCallgent;