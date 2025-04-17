import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useIsBrowser from '@docusaurus/useIsBrowser';
import { CallgentResponse } from '@site/src/types/user';
import React, { useEffect, useState } from 'react';

const ShowLogin = () => {
    const isBrowser = useIsBrowser();
    if (!isBrowser) { return null; }
    const [callgent, setCallgent] = useState<CallgentResponse>();
    const init = async () => {
        const LocCallgent = sessionStorage.getItem('callgent');
        if (LocCallgent) {
            setCallgent(JSON.parse(LocCallgent))
        }
    }
    const { siteConfig } = useDocusaurusContext();
    const appUrl = siteConfig.customFields.appUrl;
    useEffect(() => {
        init()
    }, [])
    return (
        <>
            {callgent?.name && <a href={appUrl + '/callgent/tree?callgentId=' + callgent?.id} target='_blank'>{callgent?.name}</a>}
            {!callgent?.name && <a href='/docs/quick-start/create-a-new-callgent'>Create a New Callgent</a>}
        </>
    );
};

export default ShowLogin;