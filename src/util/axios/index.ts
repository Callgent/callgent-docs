import axioshead from "axios";
import { getCookie, deleteCookie } from "../cookie";
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
const { siteConfig } = useDocusaurusContext();
const baseUrl = siteConfig.customFields;

const axios = axioshead.create({
    baseURL: baseUrl.apiSiteUrl as string,
    timeout: 20 * 1000,
});
axios.interceptors.request.use(
    (config) => {
        const token = getCookie('jwt');
        if (token) {
            config.headers.Authorization = 'Bearer ' + token;
        }
        return config;
    },
    (error) => {
        console.error('错误：', error);
        return error
    },
);
axios.interceptors.response.use(
    response => {
        return response;
    },
    async error => {
        if (error.response && error.response.status === 401) {
            deleteCookie('jwt')
            console.error('401错误：请重新登录。');
            // window.location.href = '/login';
        } else {
            console.error('其他错误：', error);
        }
        return Promise.reject(error);
    }
);
export default axios;