import useIsBrowser from '@docusaurus/useIsBrowser';
import { DocType } from '@site/src/types/user';
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './app.module.css';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
const Setting = ({ children }) => {
    const isBrowser = useIsBrowser();
    if (!isBrowser) {
        return null;
    }
    const { siteConfig } = useDocusaurusContext();

    const { fetchUserInfo } = require('@site/src/store/thunk');
    const dispatch = useDispatch();
    const { fetchState } = useSelector(
        (state: DocType) => state.user
    );
    useEffect(() => {
        // 获取用户详情
        dispatch(fetchUserInfo());
    }, [])
    const myElementRef = useRef(null);
    const closeModel = () => {
        myElementRef.current.style.display = 'none';
    }
    const handleContentClick = (event: { stopPropagation: () => void; }) => {
        event.stopPropagation();
    };
    useEffect(() => {
        // myElementRef.current.style.display = 'block';
        // myElementRef.current.style.display = 'none';
    }, [fetchState])
    return (
        <>
            <div id="myModal" onClick={closeModel} ref={myElementRef} className={styles.modal}>
                <div className={styles.modalContent} onClick={handleContentClick}>
                    <p>
                        Please&nbsp;
                        <a href={`${siteConfig.url}"/en/signin?redirect=/docs/quick-start/create-a-new-callgent"`}>Sign In</a>
                        &nbsp;first.
                    </p>
                </div>
            </div>
            {children}
        </>
    )
}

const App = ({ children }) => {
    const isBrowser = useIsBrowser();
    if (!isBrowser) {
        return null;
    }
    const { Provider } = require("react-redux")
    const { store } = require("@site/src/store/index")
    return (
        <Provider store={store} >
            <Setting>{children}</Setting>
        </Provider>
    );
};
export default App;


