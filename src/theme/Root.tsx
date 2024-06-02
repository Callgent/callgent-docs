import React from 'react';
import axios from 'axios';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function Root({ children }) {
    const { siteConfig } = useDocusaurusContext();
    const baseUrl = siteConfig.customFields.apiSiteUrl;
    axios.defaults.baseURL = baseUrl as string;
    return <>{children}</>;
}