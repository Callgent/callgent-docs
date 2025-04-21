import React, { useEffect } from 'react';
import { useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useIsBrowser from '@docusaurus/useIsBrowser';

export default function Redirect(): JSX.Element {
    const isBrowser = useIsBrowser();
    if (!isBrowser) return null;

    const location = useLocation();
    const { siteConfig } = useDocusaurusContext();

    const redirectMap = {
        app: siteConfig.customFields.appUrl
    };

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);

        for (const key in redirectMap) {
            if (searchParams.has(key)) {
                const path = searchParams.get(key);
                if (path) {
                    const targetUrl = `${redirectMap[key]}/${path}`;
                    window.location.replace(targetUrl);
                    return;
                }
            }
        }

        console.warn('No valid redirect query found:', location.search);
    }, [location]);

    return <></>;
}
