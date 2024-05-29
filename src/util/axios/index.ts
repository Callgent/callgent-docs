import axioshead from "axios";
import { getCookie, deleteCookie } from "../cookie";
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
const { siteConfig } = useDocusaurusContext();
const baseUrl = siteConfig.customFields;

axioshead.defaults.withCredentials = true;
const axios = axioshead.create({
    baseURL: baseUrl.apiSiteUrl as string,
});

axios.interceptors.request.use(
    (config) => {
        // const token = getCookie('x-callgent-jwt');
        // if (token) {
        //     config.headers['x-callgent-authorization'] = 'Bearer ' + token;
        // }
        return config;
    },
    (error) => {
        console.error('error', error);
        return error
    },
);
axios.interceptors.response.use(
    response => {
        return response;
    },
    async error => {
        if (error.response.status !== 502) {
            return Promise.reject(error.response);
        } else if (error.response && error.response.status === 401) {
            deleteCookie('x-callgent-jwt')
        } else {
            return Promise.reject({ message: 'The server is abnormal, please try again later' });
        }
    }
);
export default axios;