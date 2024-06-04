import { GlobalContext } from '@site/src/context/GlobalContext';
import useIsBrowser from '@docusaurus/useIsBrowser';
import styles from './styles.module.css';
import React, { useContext } from 'react';

const ShowLogin = () => {
    const isBrowser = useIsBrowser();
    if (!isBrowser) { return null; }
    const { state, setShowLogin } = useContext(GlobalContext);

    const handleContentClick = (event: { stopPropagation: () => void; }) => {
        event.stopPropagation();
    };

    return (
        <>
            {state.showLogin && (
                <div id="myModal" onClick={() => setShowLogin(false)} className={styles.modal}>
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