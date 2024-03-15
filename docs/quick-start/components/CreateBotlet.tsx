import useIsBrowser from '@docusaurus/useIsBrowser';
import styles from './index.module.css';
import { DocType } from '@site/src/types/user';
import React, { useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const CreateBotlet = () => {
    const isBrowser = useIsBrowser();
    if (!isBrowser) {
        return null;
    }
    const { fetchCreateBotlet } = require('@site/src/store/thunk');
    const { setStatus } = require('@site/src/store/slices/userSlice');
    const { siteConfig } = useDocusaurusContext();
    // 控制显示隐藏
    const myElementRef = useRef(null);
    const [state, setState] = useState(false)
    const { status, token } = useSelector(
        (state: DocType) => state.user
    );
    const dispatch = useDispatch();
    // 表单提交
    const [lastSubmitTime, setLastSubmitTime] = useState(0);
    const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const now = Date.now();
        if (now - lastSubmitTime < 5000) {
            return;
        }
        if (!token) {
            myElementRef.current.style.display = 'block'; // 显示模态框
            return;
        }
        const formData = new FormData(event.currentTarget);
        const formValues = Object.fromEntries(formData.entries()) as { name: string };
        dispatch(fetchCreateBotlet(formValues)).then((req) => {
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
    return (
        <>
            <div id="myModal" onClick={closeModel} ref={myElementRef} className={styles.modal}>
                <div className={styles.modalContent} onClick={handleContentClick}>
                    <p>
                        Please&nbsp;
                        <a href={siteConfig.url + "/en/signin?redirect=/docs/quick-start/create-a-new-botlet"}>Sign In</a>
                        &nbsp;first.
                    </p>
                </div>
            </div>
            <form onSubmit={onFormSubmit} className={styles.form}>
                <input
                    type="text"
                    name="name"
                    required
                    placeholder="Botlet Name"
                    className="input col col--4 margin--sm table-of-contents"
                />
                <button className="button col col--2 margin--sm button--info button--secondary">
                    Create
                </button>
                {state && <span className="margin--md text--success">Successfully created!</span>}
                {status?.isCreate && <span className={styles.please}>Please create a botlet First!</span>}
            </form>
        </>
    );
};
export default CreateBotlet;