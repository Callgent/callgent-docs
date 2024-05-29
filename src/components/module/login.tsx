import useIsBrowser from '@docusaurus/useIsBrowser';
import styles from './styles.module.css';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DocType } from '@site/src/types/user';

const ShowLogin = () => {
    const isBrowser = useIsBrowser();
    if (!isBrowser) { return null; }

    const dispatch = useDispatch();
    const { showLogin } = useSelector(
        (state: DocType) => state.user
    );

    const closeModel = () => {
        const { setShowLogin } = require('@site/src/store/slices/userSlice');
        dispatch(setShowLogin(false));
    };

    const handleContentClick = (event: { stopPropagation: () => void; }) => {
        event.stopPropagation();
    };

    return (
        <>
            {showLogin && (
                <div id="myModal" onClick={closeModel} className={styles.modal}>
                    <div className={styles.modalContent} onClick={handleContentClick}>
                        <p>
                            Please&nbsp;
                            <a href={"/docs/quick-start/register-an-account"}>Sign up</a>
                            &nbsp;first.
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};

export default ShowLogin;