import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import React, { useContext, useEffect } from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';
import ShowLogin from '../components/module/login';
import { deleteCookie } from '../util/cookie';
import { GlobalProvider } from '../context/GlobalContext';
import axios from 'axios';

export default function Root({ children }) {
    const isBrowser = useIsBrowser();
    if (!isBrowser) { return null; }

    // axios
    const { siteConfig } = useDocusaurusContext();
    const baseUrl = siteConfig.customFields.apiSiteUrl;
    axios.defaults.baseURL = baseUrl as string;
    axios.defaults.withCredentials = true;

    // userInfo
    const userInfo = () => {
        axios.get('/api/users/info').then(req => {
            const { data } = req.data;
            if (data) {
                localStorage.setItem('userinfo', JSON.stringify(data));
            } else {
                localStorage.removeItem('userinfo');
                deleteCookie('x-callgent-jwt')
            }
        })
    }

    useEffect(() => {
        userInfo();
    }, [])

    return (
        <GlobalProvider>
            <ShowLogin />
            {children}
        </GlobalProvider>
    );
}