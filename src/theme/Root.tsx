import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import React, { useEffect } from 'react';
import ShowLogin from '../components/module/login';
import { deleteCookie, setLocalStorageItem } from '../util/cookie';
import { GlobalProvider } from '../context/GlobalContext';
import { RecoilRoot } from 'recoil';
import axios from 'axios';

export default function Root({ children }) {
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
                setLocalStorageItem('userinfo', JSON.stringify(data));
            } else {
                localStorage.removeItem('userinfo');
                deleteCookie('x-callgent-jwt')
            }
        }).catch((error) => {
            console.error(error);
        })
    }

    useEffect(() => {
        userInfo();
    }, [])

    return (
        <GlobalProvider>
            <RecoilRoot>
                <ShowLogin />
                {children}
            </RecoilRoot>
        </GlobalProvider>
    );
}